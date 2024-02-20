"use strict";

const ensureString      = require("type/string/ensure")
    , isObject          = require("type/object/is")
    , memoizee          = require("memoizee")
    , fetch             = require("node-fetch")
    , ensurePackageName = require("./ensure-package-name")
    , cache             = require("./lib/cache");

module.exports = memoizee(
	async (name, options = {}) => {
		name = ensurePackageName(name);
		if (!isObject(options)) options = {};
		const registryUrl = ensureString(options.registryUrl, {
			default: "https://registry.npmjs.org"
		});
		const authToken = ensureString(options.authToken, { isOptional: true });
		const cached = (await cache.get(name)) || {};
		const response = await fetch(`${ registryUrl }/${ name }`, {
			headers: {
				accept: "application/vnd.npm.install-v1+json",
				...(authToken && { authorization: `Bearer ${ authToken }` }),
				// We do not rely on got's cache
				// as it's not effective with 'authorization' header
				...(cached.etag && { "if-none-match": cached.etag })
			}
		});
		if (response.status === 304) return cached.data;
		const result = await response.json();
		cache.set(`${ name }/registry.json`, { etag: response.headers.etag, data: result });
		return result;
	},
	{ primitive: true, promise: true }
);
