/* eslint max-statements: off, max-lines: off */

"use strict";

var invoke         = require("es5-ext/function/invoke")
  , noop           = require("es5-ext/function/noop")
  , isCallable     = require("es5-ext/object/is-callable")
  , isValue        = require("es5-ext/object/is-value")
  , forEach        = require("es5-ext/object/for-each")
  , memoize        = require("memoizee")
  , deferred       = require("deferred")
  , ignore         = require("ignore")
  , pathUtils      = require("path")
  , modes          = require("./lib/ignore-modes")
  , getMap         = require("./lib/get-conf-file-map")
  , memoizeWatcher = require("./lib/memoize-watcher")
  , findRoot       = require("./lib/find-root");

var isArray = Array.isArray
  , push = Array.prototype.push
  , call = Function.prototype.call
  , trim = call.bind(String.prototype.trim)
  , dirname = pathUtils.dirname
  , resolve = pathUtils.resolve
  , sep = pathUtils.sep
  , ConfMap = getMap.ConfMap
  , applyRules
  , applyGlobalRules
  , compile
  , IsIgnored
  , isIgnored
  , buildMap
  , prepareRules
  , parseSrc
  , eolRe = /(?:\r\n|[\n\r\u2028\u2029])/;

prepareRules = function (data) { return data.map(trim).filter(Boolean).reverse(); };

parseSrc = function (src) { return prepareRules(String(src).split(eolRe)); };

compile = function (maps, result) {
	var data = (result.data = {}), paths = (result.paths = []);

	// Merge rules found in ignorefiles
	maps.forEach(function (map) {
		forEach(map.map, function (rules, path) {
			if (!rules.length) return;
			if (!data[path]) {
				paths.push(path);
				data[path] = [];
			}
			data[path].push(rules);
		});
	});
	result.paths.sort();
	return result;
};

applyRules = function (rules, rootPath, path) {
	if (!rootPath.endsWith(sep)) rootPath += sep;
	if (!path.startsWith(rootPath)) return { value: false, target: path };
	rules = rules.slice().reverse().filter(function (rule) { return !rule.startsWith("#"); });
	var ig = ignore().add(rules);
	var testPath = path.slice(rootPath.length);
	var result = ig.ignores(testPath);
	if (!result) {
		var excludeRules = rules.filter(function (rule) { return rule.startsWith("!"); });
		if (excludeRules.length) {
			var ig2 = ignore().add(excludeRules.map(function (rule) { return rule.slice(1); }));
			if (!ig2.ignores(testPath)) result = null;
		} else {
			result = null;
		}
	}
	return { value: result, target: path };
};

applyGlobalRules = function (path, rules) {
	var value;

	// Check global rules
	value = applyRules(rules, path.slice(0, path.indexOf(sep) + 1), path);
	return Boolean(value.value);
};

buildMap = function (lDirname, lGetMap, watch) {
	var promise, data = {}, maps;
	lGetMap = lGetMap.map(function (getSubMap, index) {
		var map = getSubMap(lDirname);
		if (watch) {
			map.on("change", function (targetMap) {
				if (maps) {
					maps[index] = targetMap;
					compile(maps, data);
					promise.emit("change", data);
				}
			});
		}
		return map;
	});
	if (lGetMap.length > 1) {
		promise = deferred.map(lGetMap)(function (result) {
			maps = result;
			return compile(maps, data);
		});
	} else {
		promise = lGetMap[0](function (map) {
			maps = [map];
			return compile(maps, data);
		});
	}
	if (watch) {
		promise.close = function () { lGetMap.forEach(invoke("close")); };
	}
	return promise;
};

IsIgnored = function (path, watch) {
	this.path = path;
	this.dirname = dirname(path);
	this.watch = watch;
};

IsIgnored.prototype = {
	init: function (mapPromise) {
		this.mapPromise = mapPromise;
		this.promise = mapPromise(
			function (data) {
				this.data = data;
				return this.calculate();
			}.bind(this)
		);
		if (this.watch) {
			mapPromise.on(
				"change",
				function () {
					var value = this.calculate();
					if (value !== this.promise.value) {
						this.promise.value = value;
						this.promise.emit("change", value, this.path);
					}
				}.bind(this)
			);
			this.promise.close = this.close.bind(this);
		}
		return this.promise;
	},
	close: function () { this.mapPromise.close(); },
	calculate: function () {
		var current, result = false;

		if (!this.data.paths) return false;

		// Apply rules
		current = this.path;
		this.data.paths.some(function (rulesPath, index) {
			if (rulesPath.length > this.dirname.length) return true;
			if (index) {
				var dirIgnored = this.data.paths.slice(0, index).some(function (preRulesPath) {
					return this.data.data[preRulesPath].some(function (rules) {
						return applyRules(rules, preRulesPath, rulesPath).value;
					}, this);
				}, this);
				if (dirIgnored) return false;
			}
			this.data.data[rulesPath].forEach(function (rules) {
				var data = applyRules(rules, rulesPath, current);
				if (data.value === false && current !== pathUtils) {
					data = applyRules(rules, rulesPath, this.path);
				}
				if (data.target !== current || isValue(data.value)) {
					result = data.value;
				}
				current = data.target;
			}, this);
			return false;
		}, this);
		return Boolean(result);
	}
};

isIgnored = function (mode, path, options) {
	var watch, globalRules, lIsIgnored, getMapFns, lDirname, promise;

	if (isValue(options.globalRules)) {
		globalRules = isArray(options.globalRules)
			? options.globalRules
			: String(options.globalRules).split(eolRe);
	}

	if (mode) {
		getMapFns = [];
		if (!globalRules) globalRules = [];
		if (!isArray(mode)) {
			if (!modes[mode]) throw new Error("Unknown mode '" + mode + "'");
			mode = [mode];
		}
		mode.forEach(function (name) {
			var lMode = modes[name];
			if (!lMode) throw new Error("Unknown mode '" + name + "'");
			getMapFns.push(function (pathIgnored) {
				return getMap(lDirname, lMode, watch, parseSrc);
			});
			if (lMode.globalRules) push.apply(globalRules, lMode.globalRules);
		});
	}
	watch = options.watch;

	if (globalRules) {
		globalRules = prepareRules(globalRules);
		if (applyGlobalRules(path, globalRules)) {
			promise = deferred(true);
			if (watch) promise.close = noop;
			return promise;
		}
	}

	if (!mode) {
		promise = deferred(false);
		if (watch) promise.close = noop;
		return promise;
	}

	lIsIgnored = new IsIgnored(path, watch);
	lDirname = lIsIgnored.dirname;
	return lIsIgnored.init(buildMap(lDirname, getMapFns, watch));
};
isIgnored.returnsPromise = true;

module.exports = exports = function (mode, path) {
	var options, cb;
	path = resolve(String(path));

	options = Object(arguments[2]);
	cb = arguments[3];
	if (!cb) {
		if (isCallable(options)) {
			cb = options;
			options = {};
		}
	}
	return isIgnored(mode, path, options).cb(cb);
};

exports.returnsPromise = true;
exports.isIgnored = isIgnored;
exports.IsIgnored = IsIgnored;
exports.applyGlobalRules = applyGlobalRules;

exports.getIsIgnored = function (modeNames, globalRules, watch) {
	var memo, mapGetters = [], build;
	if (!globalRules) globalRules = [];
	memo = watch ? memoizeWatcher : memoize;
	modeNames.forEach(function (name) {
		var mode = modes[name], isRoot, readRules;
		if (!mode) throw new Error("Unknown mode '" + name + "'");
		isRoot = memo(mode[watch ? "isRootWatcher" : "isRoot"], { primitive: true });
		readRules = memo(getMap[watch ? "readRulesWatcher" : "readRules"], { primitive: true });
		mapGetters.push(function (path) {
			var map;
			map = new ConfMap(path, watch);
			map.filename = mode.filename;
			map.readRules = readRules;
			map.parse = parseSrc;
			return map.init(findRoot(isRoot, path, { watch: watch }));
		});
		if (mode.globalRules) push.apply(globalRules, mode.globalRules);
	});
	build = memo(function (lDirname) { return buildMap(lDirname, mapGetters, watch); }, {
		primitive: true
	});

	return {
		isIgnored: function (path) {
			var lIsIgnored;
			lIsIgnored = new IsIgnored(path, watch);
			return lIsIgnored.init(build(lIsIgnored.dirname));
		},
		globalRules: globalRules.length ? prepareRules(globalRules) : null
	};
};
