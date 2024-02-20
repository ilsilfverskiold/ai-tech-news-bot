"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , isString   = require("es5-ext/string/is-string")
  , deferred   = require("deferred")
  , pathUtils  = require("path")
  , original   = require("fs").appendFile
  , mkdir      = require("./mkdir").mkdir
  , dirname    = pathUtils.dirname
  , resolve    = pathUtils.resolve;

var _appendFile = function (path, data, options, pResolve, reject) {
	original(path, data, options, function (err) {
		var dir;
		if (!isValue(err)) {
			pResolve(null);
			return;
		}
		if (!options.intermediate) {
			reject(err);
			return;
		}
		if (err.code !== "ENOENT") {
			reject(err);
			return;
		}
		dir = dirname(path);
		if (dir === path) {
			reject(err);
			return;
		}
		mkdir(dir, { intermediate: true }).cb(function () {
			_appendFile(path, data, options, pResolve, reject);
		}, reject);
	});
};
var appendFile = function (path, data, options) {
	var def = deferred();
	_appendFile(path, data, options, def.resolve, def.reject);
	return def.promise;
};
appendFile.returnsPromise = true;

module.exports = exports = function (path, data/*, options*/) {
	var cb, options;

	path = resolve(String(path));
	options = arguments[2];
	cb = arguments[3];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = isString(options) ? { encoding: options } : Object(options);
	}

	return appendFile(path, data, options).cb(cb);
};
exports.returnsPromise = true;
exports.appendFile = appendFile;
