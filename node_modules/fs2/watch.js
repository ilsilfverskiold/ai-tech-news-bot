/* eslint max-statements: off */

"use strict";

var last           = require("es5-ext/array/#/last")
  , remove         = require("es5-ext/array/#/remove")
  , descHandler    = require("./descriptors-handler")
  , resolve        = require("path").resolve
  , watchReg       = require("./lib/watch")
  , watchAlt       = require("./lib/watch-alt")
  , memoizeWatcher = require("./lib/memoize-watcher")
  , max            = Math.max
  , watch
  , compare
  , releaseDescs
  , switchToAlt
  , switchToReg
  , switchAltsToReg
  , onLstat
  , isAvail
  , watchers       = { reg: [], alt: [] };

compare = function (watcherA, watcherB) { return watcherB.count - watcherA.count; };

isAvail = function () { return descHandler.available > 50; };

switchToAlt = function (watcher) {
	var closePrevious = watcher.emitter._close;
	remove.call(watchers.reg, watcher);
	try {
		watchAlt(watcher.path, watcher.emitter);
	} catch (err) {
		if (err.code === "ENOENT" || err.code === "DIFFTYPE") {
			watcher.emitter.end(err);
			return;
		}
		throw err;
	}
	closePrevious();
	descHandler.close();
	watcher.alt = true;
	onLstat(watcher);
	watchers.alt.push(watcher);
	watchers.alt.sort(compare);
};

switchToReg = function (watcher) {
	var emitter = watcher.emitter, closePrevious = emitter._close;

	try {
		watchReg(watcher.path, watcher.emitter);
	} catch (err) {
		if (err.code === "EMFILE") {
			descHandler.limit = descHandler.taken;
			releaseDescs();
			return;
		}
		if (err.code === "ENOENT" || err.code === "DIFFTYPE") {
			emitter.off("change", emitter._watchSwitchListener);
			delete emitter._watchSwitchListener;
			remove.call(watchers.alt, watcher);
			watcher.emitter.end(err);
			return;
		}
		throw err;
	}
	emitter.off("change", emitter._watchSwitchListener);
	delete emitter._watchSwitchListener;
	remove.call(watchers.alt, watcher);
	closePrevious();
	descHandler.open();
	watcher.alt = false;
	watchers.reg.push(watcher);
	watchers.reg.sort(compare);
};

switchAltsToReg = function () {
	while (watchers.alt.length && isAvail()) {
		switchToReg(watchers.alt[0]);
	}
};

releaseDescs = function () {
	var count = max(watchers.reg.length - (descHandler.taken - 50), 0);
	if (count) {
		watchers.reg.sort(compare).slice(-count).forEach(switchToAlt);
	}
};

onLstat = function (watcher) {
	var emitter = watcher.emitter;
	emitter.on(
		"change",
		(emitter._watchSwitchListener = function () {
			var candidate;
			watchers.alt.sort(compare);
			if (watchers.alt[0] !== watcher) return;

			if (isAvail()) {
				switchAltsToReg();
			} else if (watchers.reg.length) {
				candidate = last.call(watchers.reg.sort(compare));
				if (candidate.count >= watcher.count) return;

				// Move last regular watcher to lstat watch
				switchToAlt(candidate);

				// Move current watcher to regular watch
				switchToReg(watcher);
			}
		})
	);
};

watch = memoizeWatcher(
	function self(path) {
		var emitter, watcher;
		watcher = { path: path, count: 0 };
		if (isAvail()) {
			try {
				emitter = watcher.emitter = watchReg(path);
			} catch (e) {
				if (e.code === "EMFILE") {
					descHandler.limit = descHandler.taken;
					releaseDescs();
					return self(path);
				}
				throw e;
			}
			descHandler.open();
			watchers.reg.push(watcher);
		} else {
			emitter = watcher.emitter = watchAlt(path);
			watcher.alt = true;
			watchers.alt.push(watcher);
		}
		emitter._close = emitter.close;
		emitter.close = function () {
			emitter._close();
			remove.call(watchers[watcher.alt ? "alt" : "reg"], watcher);
			if (!watcher.alt) {
				descHandler.close();
				// Switch if possible
				switchAltsToReg();
			}
		};
		emitter.on("end", function () {
			watch.clear(path);
			emitter.close();
		});
		emitter.on("change", function () { ++watcher.count; });
		if (watcher.alt) {
			onLstat(watcher);
		}
		return emitter;
	},
	{ primitive: true }
);

module.exports = exports = function (path) { return watch(resolve(String(path))); };
exports.watch = watch;
