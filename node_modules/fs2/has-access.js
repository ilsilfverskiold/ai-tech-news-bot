"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , resolve    = require("path").resolve
  , access     = require("./access");

module.exports = function (path/*[, options[, callback]]*/) {
	path = resolve(String(path));
	var options = arguments[1], cb = arguments[2];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	}
	options = Object(options);
	return access(path, options.mode)
		.then(
			function () { return true; },
			function (error) {
				if (options.loose && (error.code === "ENOENT" || error.code === "ENOTDIR")) {
					return null;
				}
				if (error.code === "EACCES") return false;
				throw error;
			}
		)
		.cb(cb);
};
