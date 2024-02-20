"use strict";

if (process.platform === "win32") {
	module.exports = null;
	return;
}

var isValue         = require("type/value/is")
  , isObject        = require("type/object/is")
  , isPlainFunction = require("type/plain-function/is")
  , deferred        = require("deferred")
  , resolve         = require("path").resolve
  , original        = require("fs").chmod
  , lstat           = require("./lstat").lstat;

var bareChmod = function (path, mode) {
	var def = deferred();
	original(path, mode, function (err, stats) {
		if (err) def.reject(err);
		else def.resolve(stats);
	});
	return def.promise;
};

var chmod = function (path, mode, options) {
	if (!options.append) return bareChmod(path, mode);
	return lstat(path).then(function (stats) {
		var targetMode = stats.mode | mode;
		if (targetMode === stats.mode) return stats;
		return bareChmod(path, targetMode);
	});
};
chmod.returnsPromise = true;

module.exports = exports = function (path, mode/*, options, callback*/) {
	var options = arguments[2], callback = arguments[3];
	if (!isValue(callback) && isPlainFunction(options)) {
		callback = options;
		options = {};
	} else if (!isObject(options)) {
		options = {};
	}
	return chmod(resolve(String(path)), mode, options).cb(callback);
};
exports.returnsPromise = true;
exports.chmod = chmod;
