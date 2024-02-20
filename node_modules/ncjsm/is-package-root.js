"use strict";

const ensureString = require("type/string/ensure")
    , deferred     = require("deferred")
    , { resolve }  = require("path")
    , stat         = require("fs2/stat");

module.exports = function (path) {
	path = ensureString(path);
	return deferred.some([
		stat(resolve(path, "package.json"))(
			stats => stats.isFile(),
			e => {
				if (e.code === "ENOENT") return false;
				throw e;
			}
		),
		stat(resolve(path, "node_modules"))(
			stats => stats.isDirectory(),
			e => {
				if (e.code === "ENOENT") return false;
				throw e;
			}
		)
	]);
};
