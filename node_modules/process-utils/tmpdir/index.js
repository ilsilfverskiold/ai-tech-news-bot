"use strict";

const memoizee  = require("memoizee")
    , path      = require("path")
    , fs        = require("fs").promises
    , rmdirSync = require("fs2/rmdir-sync")
    , crypto    = require("crypto")
    , os        = require("os");

const prefix = "node-process-";

module.exports = memoizee(
	async function self() {
		const processTmpDir = path.join(
			os.tmpdir(), `${ prefix }${ crypto.randomBytes(2).toString("hex") }`
		);
		try {
			await fs.mkdir(processTmpDir);
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
			return self();
		}

		process.on("exit", () => {
			try { rmdirSync(processTmpDir); }
			catch {}
		});

		return processTmpDir;
	},
	{ promise: true }
);
