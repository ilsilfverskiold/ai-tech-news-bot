"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , dirname    = require("path").dirname
  , resolve    = require("path").resolve
  , readlink   = require("./readlink").readlink
  , realpath   = require("./realpath").realpath;

module.exports = function (path/*[, options[, callback]]*/) {
	path = resolve(String(path));
	var options = arguments[1], cb = arguments[2];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = Object(options);
	}
	var expectedLinkPath = options.linkPath ? resolve(String(options.linkPath)) : null;
	return readlink(path, {})(
		function (linkPath) {
			if (!linkPath) return null;
			if (!expectedLinkPath) return true;
			if (!options.recursive) return resolve(dirname(path), linkPath) === expectedLinkPath;
			return realpath(path, { loose: true })(function (finalLinkPath) {
				if (!finalLinkPath) return false;
				return finalLinkPath === expectedLinkPath;
			});
		},
		function (error) {
			if (error.code === "ENOENT") return null;
			if (error.code === "EINVAL") return false;
			if (error.code === "ENOTDIR") return null;
			if (error.code === "UNKNOWN") return null;
			throw error;
		}
	).cb(cb);
};
module.exports.returnsPromise = true;
