"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , resolve    = require("path").resolve
  , lstat      = require("./lstat")
  , rmdir      = require("./rmdir")
  , unlink     = require("./unlink");

var rm = function (path, options) {
	return lstat(path, options)(function (stats) {
		if (!stats) return null; // loose option
		if (stats.isDirectory()) return rmdir(path, options);
		return unlink(path, options);
	});
};
rm.returnsPromise = true;

module.exports = function (path/*[, options[, callback]]*/) {
	var options, cb;

	path = resolve(String(path));
	options = arguments[1];
	cb = arguments[2];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = Object(options);
	}

	return rm(path, options).cb(cb);
};
module.exports.returnsPromise = true;
module.exports.rm = rm;
