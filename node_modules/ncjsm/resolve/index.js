// Async module resolver

"use strict";

const getResolver = require("../lib/get-node-resolver")
    , { resolve } = require("path")
    , stat        = require("fs2/stat")
    , readFile    = require("fs2/read-file")
    , realpath    = require("fs2/realpath");

const { parse } = JSON;

module.exports = getResolver(
	targetPath => {
		targetPath = resolve(targetPath);
		return stat(targetPath)
			.then(stats => {
				if (!stats.isFile()) return null;
				return realpath(targetPath).then(realPath => ({ targetPath, realPath }));
			})
			.catch(e => {
				if (e.code === "ENOENT") return null;
				throw e;
			});
	},
	path =>
		readFile(resolve(path, "package.json"))(
			data => {
				try { return parse(data).main; }
				catch (e) { return null; }
			},
			e => {
				if (e.code === "ENOENT") return null;
				throw e;
			}
		)
);
