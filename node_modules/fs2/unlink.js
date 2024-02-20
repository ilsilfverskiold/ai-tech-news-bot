"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , deferred   = require("deferred")
  , resolve    = require("path").resolve
  , original   = require("fs").unlink
  , unlink;

unlink = function (path, options) {
	var def = deferred();
	original(path, function (err) {
		if (err) {
			if (err.code === "ENOENT" && options.loose) def.resolve();
			else def.reject(err);
			return;
		}
		def.resolve();
	});
	return def.promise;
};
unlink.returnsPromise = true;

module.exports = exports = function (path /* [, options[, callback]]*/) {
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

	return unlink(path, options).cb(cb);
};
exports.returnsPromise = true;
exports.unlink = unlink;
