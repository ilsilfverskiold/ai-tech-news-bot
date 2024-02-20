"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , deferred   = require("deferred")
  , resolve    = require("path").resolve
  , original   = require("fs").readlink;

var readlink = function (path, options) {
	var def = deferred();
	original(path, options, function (err, stats) {
		if (err) {
			if (
				options.loose &&
				(err.code === "ENOENT" ||
					err.code === "EINVAL" ||
					err.code === "ENOTDIR" ||
					err.code === "UNKNOWN")
			) {
				def.resolve(null);
			} else {
				def.reject(err);
			}
		} else {
			def.resolve(stats);
		}
	});
	return def.promise;
};
readlink.returnsPromise = true;

module.exports = function (path/*[, options[, callback]]*/) {
	var options, cb;

	path = resolve(String(path));
	options = arguments[1];
	cb = arguments[2];
	if (!isValue(cb) && isCallable(options)) {
		cb = Object(options);
		options = {};
	} else {
		options = Object(options);
	}

	return readlink(path, options).cb(cb);
};
module.exports.returnsPromise = true;
module.exports.readlink = readlink;
