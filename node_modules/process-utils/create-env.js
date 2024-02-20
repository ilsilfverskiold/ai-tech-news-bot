"use strict";

const ensureIterable    = require("type/iterable/ensure")
    , ensureObject      = require("type/object/ensure")
    , isObject          = require("type/object/is")
    , ensurePlainObject = require("type/plain-object/ensure")
    , ensureString      = require("type/string/ensure")
    , entries           = require("ext/object/entries");

const objHasOwnProperty = Object.prototype.hasOwnProperty;

module.exports = (options = {}) => {
	if (!isObject(options)) options = {};
	if (options.asCopy && options.whitelist) {
		throw new Error("Either `asCopy` or `whitelist` option is expected but not both");
	}
	const whitelist = ensureIterable(options.whitelist, {
		isOptional: true,
		ensureItem: ensureString,
		errorMessage: "`whitelist` expected to be a string collection, got %v"
	});
	const variables = ensurePlainObject(options.variables, {
		isOptional: true,
		ensurePropertyValue: ensureString,
		errorMessage:
			"`variables` expected to be a plain object with string property values, got %v"
	});
	const env = new Proxy(
		{},
		{
			defineProperty(target, key, inputDescriptor) {
				return Object.defineProperty(target, key, {
					configurable: true,
					enumerable: true,
					value: `${ ensureObject(inputDescriptor).value }`,
					writable: true
				});
			}
		}
	);
	if (options.asCopy) for (const [varName, value] of entries(process.env)) env[varName] = value;
	if (whitelist) {
		for (const varName of whitelist) {
			if (objHasOwnProperty.call(process.env, varName)) env[varName] = process.env[varName];
		}
	}
	if (variables) for (const [varName, value] of entries(variables)) env[varName] = value;

	return env;
};
