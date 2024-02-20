"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , deferred   = require("deferred")
  , resolve    = require("path").resolve
  , fs         = require("fs");

var original = fs.access, defaultMode = (fs.constants || fs).R_OK;

var access = function (path, mode) {
	var def = deferred();
	original(path, mode, function (err, stats) {
		if (err) {
			def.reject(err);
		} else {
			def.resolve(stats);
		}
	});
	return def.promise;
};
access.returnsPromise = true;

module.exports = function (path/*[, mode[, callback]]*/) {
	var mode, cb;

	path = resolve(String(path));
	mode = arguments[1];
	cb = arguments[2];
	if (!isValue(cb) && isCallable(mode)) {
		cb = mode;
		mode = defaultMode;
	} else if (isValue(mode)) {
		mode = Number(mode);
	}

	return access(path, mode).cb(cb);
};
module.exports.returnsPromise = true;
module.exports.access = access;
