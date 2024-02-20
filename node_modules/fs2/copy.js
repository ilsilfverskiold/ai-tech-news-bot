/* eslint max-lines: off */

// Copy file
// Credit: Isaac Schlueter
// http://groups.google.com/group/nodejs/msg/ef4de0b516f7d5b8

"use strict";

var isCallable       = require("es5-ext/object/is-callable")
  , isValue          = require("es5-ext/object/is-value")
  , normalizeOptions = require("es5-ext/object/normalize-options")
  , d                = require("d")
  , deferred         = require("deferred")
  , fs               = require("fs")
  , path             = require("path")
  , mkdir            = require("./mkdir")
  , rm               = require("./rm")
  , unlink           = require("./unlink");

var objHasOwnProperty = Object.prototype.hasOwnProperty
  , defineProperty = Object.defineProperty
  , dirname = path.dirname
  , resolve = path.resolve
  , createReadStream = fs.createReadStream
  , createWriteStream = fs.createWriteStream
  , stat = fs.stat;

var fixOptions = function (options) {
	if (options.hasOwnProperty) return options;
	return defineProperty(options, "hasOwnProperty", d(objHasOwnProperty));
};

var copyFileWithMode = function (def, source, dest, options) {
	var read, write;
	var isReadDisposed = false;

	try { read = createReadStream(source); }
	catch (e) { return def.reject(e); }
	read.on("error", function (e) {
		if (isReadDisposed) return;
		if (options.loose && e.code === "ENOENT") def.resolve(unlink(dest, { loose: true })(false));
		else def.reject(e);
	});

	try {
		write = createWriteStream(dest, fixOptions(options));
	} catch (e1) {
		read.destroy();
		return def.reject(e1);
	}

	write.on("error", function (e) {
		isReadDisposed = true;
		read.destroy();
		if (e.code === "ENOENT" && options.intermediate) {
			mkdir(dirname(resolve(dest)), { intermediate: true }).done(function () {
				options = normalizeOptions(options);
				delete options.intermediate;
				return copyFileWithMode(def, source, dest, options);
			}, def.reject);
			return;
		}
		def.reject(e);
	});
	read.pipe(write);
	write.on("close", def.resolve.bind(def, true));

	return def.promise;
};

var copyFile = function (source, dest, options) {
	var def = deferred();
	if (options.mode) {
		copyFileWithMode(def, source, dest, options);
		return def.promise;
	}
	stat(source, function (e, stats) {
		if (e) {
			if (options.loose && e.code === "ENOENT") {
				def.resolve(false);
				return;
			}
			def.reject(e);
			return;
		}
		options = normalizeOptions(options);
		options.mode = stats.mode;
		stat(dest, function (error) {
			if (!error) {
				if (options.force) {
					rm(dest, { recursive: true, force: true, loose: true }).then(function () {
						return copyFileWithMode(def, source, dest, options);
					});
				} else {
					def.reject(new Error("Destinaton '" + dest + "' exists"));
				}
			} else if (error.code === "ENOENT") {
				copyFileWithMode(def, source, dest, options);
			} else {
				def.reject(error);
			}
		});
	});
	return def.promise;
};
copyFile.returnsPromise = true;

module.exports = exports = function (source, dest/*, options, cb*/) {
	var options = Object(arguments[2]), cb = arguments[3];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	}

	return copyFile(String(source), String(dest), options).cb(cb);
};
exports.copy = copyFile;
exports.returnsPromise = true;
