"use strict";

var isCallable = require("es5-ext/object/is-callable")
  , isValue    = require("es5-ext/object/is-value")
  , isString   = require("es5-ext/string/is-string")
  , deferred   = require("deferred")
  , original   = require("fs").readFile
  , resolve    = require("path").resolve
  , watch      = require("./watch").watch
  , WatchPath  = require("./watch-path").WatchPath
  , readFile;

readFile = function (filename, options) {
	var def, current, promise, watcher, resolveCb, onchange, loose;

	def = deferred();
	loose = options.loose;
	original(
		filename,
		options.encoding,
		(resolveCb = function (err, data) {
			if (def.resolved) return;
			if (err) {
				if (watcher && !loose) watcher.close();
				if (loose) def.resolve(null);
				else def.reject(err);
				return;
			}
			if (options.watch) current = String(data);
			def.resolve(data);
		})
	);
	promise = def.promise;

	if (options.watch) {
		onchange = function () {
			original(filename, options.encoding, function (err, data) {
				var dataStr;
				if (!def.resolved) {
					resolveCb(err, data);
					return;
				}
				if (!watcher) return;
				if (err) {
					watcher.close();
					promise.emit("end");
					return;
				}
				dataStr = String(data);
				if (dataStr !== current) {
					current = dataStr;
					promise.emit("change", data);
				}
			});
		};
		if (loose) {
			current = null;
			watcher = new WatchPath(filename);
			watcher.on("change", function (event) {
				if (event.type === "remove") {
					if (isValue(current)) promise.emit("change", (current = null));
				} else {
					onchange();
				}
			});
		} else {
			try { watcher = watch(filename); }
			catch (e) { return def.reject(e); }
			watcher.on("change", onchange);
			watcher.on("end", function () {
				watcher = null;
				promise.emit("end");
			});
		}
		promise.close = function () {
			watcher.close();
			if (!def.resolved) {
				def.reject(new Error("Operation aborted: " + filename));
			}
		};
	}

	return promise;
};
readFile.returnsPromise = true;

module.exports = exports = function (filename) {
	var options, cb;

	filename = resolve(String(filename));
	options = arguments[1];
	cb = arguments[2];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	} else {
		options = isString(options) ? { encoding: options } : Object(options);
	}

	return readFile(filename, options).cb(cb);
};
exports.returnsPromise = true;
exports.readFile = readFile;
