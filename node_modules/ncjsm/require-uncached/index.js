"use strict";

var objForEach          = require("es5-ext/object/for-each")
  , clear               = require("es5-ext/object/clear")
  , isObject            = require("type/object/is")
  , isPlainFunction     = require("type/plain-function/is")
  , ensureIterable      = require("type/iterable/ensure")
  , ensureString        = require("type/string/ensure")
  , ensurePlainFunction = require("type/plain-function/ensure")
  , isThenable          = require("type/thenable/is")
  , finallyMethod       = require("ext/thenable_/finally");

module.exports = function (moduleIds, callback) {
	if (isPlainFunction(moduleIds)) {
		callback = moduleIds;
		moduleIds = null;
	} else {
		if (isObject(moduleIds)) {
			moduleIds = ensureIterable(moduleIds, {
				ensureItem: ensureString,
				name: "moduleIds",
				denyEmpty: true
			});
		} else {
			moduleIds = [ensureString(moduleIds)];
		}
		callback = ensurePlainFunction(callback, { name: "callback" });
	}

	var cache = {};

	if (moduleIds) {
		moduleIds.forEach(function (moduleId) {
			cache[moduleId] = require.cache[moduleId];
			delete require.cache[moduleId];
		});
	} else {
		Object.assign(cache, require.cache);
		clear(require.cache);
	}

	var restore = function () {
		if (!moduleIds) {
			Object.keys(require.cache).forEach(function (moduleId) {
				if (!cache[moduleId]) delete require.cache[moduleId];
			});
		}
		objForEach(cache, function (value, moduleId) {
			if (value) require.cache[moduleId] = value;
			else delete require.cache[moduleId];
		});
	};

	var result;
	try {
		result = callback();
	} catch (error) {
		restore();
		throw error;
	}
	if (!isThenable(result)) {
		restore();
		return result;
	}
	return finallyMethod.call(result, restore);
};
