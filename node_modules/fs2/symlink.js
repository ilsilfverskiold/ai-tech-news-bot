"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , isString   = require("es5-ext/string/is-string")
  , deferred   = require("deferred")
  , path       = require("path")
  , original   = require("fs").symlink
  , mkdir      = require("./mkdir");

var dirname = path.dirname, resolve = path.resolve, symlink;

symlink = function (src, dest, options) {
	var def = deferred();
	original(src, dest, options.type, function (err) {
		if (err) {
			def.reject(err);
			return;
		}
		def.resolve();
	});
	return def.promise;
};
symlink.returnsPromise = true;

module.exports = exports = function (src, dest /* [, options[, callback]]*/) {
	var options, cb;

	src = String(src);
	dest = resolve(String(dest));
	options = arguments[2];
	cb = arguments[3];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = isString(options) ? { type: options } : Object(options);
	}

	if (options.intermediate) {
		return mkdir(dirname(dest), { intermediate: true })(function () {
			return symlink(src, dest, options);
		}).cb(cb);
	}

	return symlink(src, dest, options).cb(cb);
};
exports.returnsPromise = true;
exports.symlink = symlink;
