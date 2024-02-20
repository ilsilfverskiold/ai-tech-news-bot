"use strict";

const ensureString        = require("type/string/ensure")
    , ensurePlainFunction = require("type/plain-function/ensure")
    , { resolve }         = require("path")
    , processCallback     = require("./lib/private/process-callback");

module.exports = (counterpart, callback = null) => {
	counterpart = resolve(ensureString(counterpart));
	ensurePlainFunction(callback, { isOptional: true });

	const original = process.cwd();
	process.chdir(counterpart);
	const restore = () => process.chdir(original);

	if (!callback) return { originalCwd: original, restoreCwd: restore };
	return processCallback(callback, [original], restore);
};
