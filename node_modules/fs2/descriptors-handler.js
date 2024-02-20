/* eslint max-lines: off */

"use strict";

var last         = require("es5-ext/array/#/last")
  , defineLength = require("es5-ext/function/_define-length")
  , callable     = require("es5-ext/object/valid-callable")
  , d            = require("d")
  , memoize      = require("memoizee")
  , fs           = require("fs");

var max = Math.max
  , slice = Array.prototype.slice
  , limit = Infinity
  , count = 0
  , queue = []
  , debugStats = { fd: 0, unknown: 0 };

var release = function () {
	var data, fnCb;
	// eslint-disable-next-line no-unmodified-loop-condition
	while (count < limit && (data = queue.shift())) {
		try {
			data.fn.apply(data.context, data.args);
		} catch (e) {
			fnCb = last.call(data.args);
			if (typeof fnCb === "function") fnCb(e);
		}
	}
};

var wrap = function (asyncFn, type) {
	var self;
	debugStats[type] = 0;
	callable(asyncFn);
	return (self = defineLength(function () {
		var openCount, args = arguments, context, cb = last.call(args);
		if (!exports.initialized || typeof cb !== "function") return asyncFn.apply(this, arguments);
		if (count >= limit) {
			queue.push({ fn: self, context: this, args: arguments });
			return null;
		}
		openCount = count++;
		context = this;
		args = slice.call(args, 0, -1);
		args.push(function (err, resultIgnored) {
			--debugStats[type];
			--count;
			if (err && (err.code === "EMFILE" || err.code === "ENFILE")) {
				if (limit > openCount) limit = openCount;
				queue.push({ fn: self, context: context, args: args });
				release();
				return;
			}
			release();
			if (typeof cb === "function") cb.apply(this, arguments);
		});
		++debugStats[type];
		return asyncFn.apply(this, args);
	}, asyncFn.length));
};

module.exports = exports = memoize(function () {
	var open = fs.open, openSync = fs.openSync, close = fs.close, closeSync = fs.closeSync;

	if (exports.initialized) return;

	fs.open = function (path, flags, mode, fnCb) {
		var openCount, args;
		if (count >= limit) {
			queue.push({ fn: fs.open, context: this, args: arguments });
			return;
		}
		openCount = count++;
		args = arguments;
		fnCb = last.call(args);
		++debugStats.fd;
		open(path, flags, mode, function (err, fd) {
			if (err) {
				--debugStats.fd;
				--count;
				if (err.code === "EMFILE" || err.code === "ENFILE") {
					if (limit > openCount) limit = openCount;
					queue.push({ fn: fs.open, context: this, args: args });
					release();
					return;
				}
				release();
			}
			if (typeof fnCb === "function") fnCb(err, fd);
		});
	};

	fs.openSync = function (pathIgnored, flagsIgnored, modeIgnored) {
		var result = openSync.apply(this, arguments);
		++debugStats.fd;
		++count;
		return result;
	};

	fs.close = function (fd, fnCb) {
		close(fd, function (err) {
			if (!err) {
				--debugStats.fd;
				--count;
				release();
			}
			if (typeof fnCb === "function") fnCb(err);
		});
	};

	fs.closeSync = function (fd) {
		var result;
		result = closeSync(fd);
		--debugStats.fd;
		--count;
		release();
		return result;
	};

	fs.readdir = wrap(fs.readdir, "readdir");
	// Needed for Node >=1.2 because of commit e65308053c
	fs.readFile = wrap(fs.readFile, "readFile");

	Object.defineProperty(exports, "initialized", d("e", true));
});

Object.defineProperties(exports, {
	initialized: d("ce", false),
	limit: d.gs(
		function () { return limit; },
		function (nLimit) { if (limit >= nLimit) limit = max(nLimit, 5); }
	),
	available: d.gs(function () { return max(limit - count, 0); }),
	taken: d.gs(function () { return count; }),
	open: d(function () {
		++debugStats.unknown;
		++count;
	}),
	close: d(function () {
		--debugStats.unknown;
		--count;
		if (release) release();
	}),
	wrap: d(wrap),
	debugStats: d(debugStats)
});
