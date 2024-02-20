"use strict";

const ensureArrayLength   = require("type/array-length/ensure")
    , ensureIterable      = require("type/iterable/ensure")
    , ensureString        = require("type/string/ensure")
    , isPlainFunction     = require("type/plain-function/is")
    , ensurePlainFunction = require("type/plain-function/ensure")
    , isObject            = require("type/object/is")
    , processCallback     = require("./lib/private/process-callback");

module.exports = (options = {}, callback = null) => {
	ensurePlainFunction(callback, { isOptional: true });
	if (!callback && isPlainFunction(options)) {
		callback = options;
		options = {};
	} else if (!isObject(options)) {
		options = {};
	}
	const sliceAt = ensureArrayLength(options.sliceAt, { default: 1 });
	const args = ensureIterable(options.args, { isOptional: true });
	const original = process.argv;
	const counterpart = process.argv.slice(0, sliceAt);
	if (args) counterpart.push(...Array.from(args, ensureString));
	process.argv = counterpart;
	const restore = () => (process.argv = original);

	if (!callback) return { originalArgv: original, restoreArgv: restore };
	return processCallback(callback, [original], restore);
};
