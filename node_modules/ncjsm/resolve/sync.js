// Sync module resolver

"use strict";

const { resolve } = require("path")
    , PassThru    = require("../utils/pass-thru")
    , getResolver = require("../lib/get-node-resolver");

const { statSync: stat, readFileSync: readFile, realpathSync: realpath } = require("fs");

const { parse } = JSON;

const resolver = getResolver(
	targetPath => {
		let stats;
		targetPath = resolve(targetPath);
		try {
			stats = stat(targetPath);
		} catch (e) {
			if (e.code === "ENOENT") return new PassThru(null);
			throw e;
		}
		if (stats.isFile()) return new PassThru({ targetPath, realPath: realpath(targetPath) });
		return new PassThru(null);
	},
	path => {
		let data, result;
		try {
			data = readFile(resolve(path, "package.json"));
		} catch (e) {
			if (e.code === "ENOENT") return new PassThru(null);
			throw e;
		}
		try { result = parse(data).main; }
		catch (e) { result = null; }
		return new PassThru(result);
	}
);

module.exports = function (dir, path, options = {}) { return resolver(dir, path, options).value; };
