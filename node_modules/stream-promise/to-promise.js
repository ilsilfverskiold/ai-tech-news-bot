"use strict";

const isObject      = require("es5-ext/object/is-object")
    , toShortString = require("es5-ext/to-short-string-representation")
    , isStream      = require("is-stream");

module.exports = (stream, options = {}) => {
	if (!isObject(options)) options = {};
	if (!isStream(stream)) throw new TypeError(`${ toShortString(stream) } is not a stream`);
	if (!isStream.readable(stream) && !isStream.writable(stream)) {
		throw new TypeError(
			`${ toShortString(stream) } stream is recognized neither as readable nor writeable`
		);
	}
	let result = null;
	const promise = new Promise((resolve, reject) => {
		stream.on("error", reject);

		if (isStream.readable(stream)) {
			if (options.noCollect) {
				result = undefined;
			} else if (stream._readableState.objectMode) {
				result = [];
				stream.on("data", data => result.push(data));
			} else {
				stream.on("data", data => {
					if (typeof data === "string") {
						if (!result) {
							promise.emittedData = result = data;
						} else if (Buffer.isBuffer(data)) {
							promise.emittedData = result = Buffer.concat([data, Buffer.from(data)]);
						} else {
							promise.emittedData = result += data;
						}
					} else if (!result) {
						promise.emittedData = result = data;
					} else if (Buffer.isBuffer(result)) {
						promise.emittedData = result = Buffer.concat([result, data]);
					} else {
						promise.emittedData = result = Buffer.concat([Buffer.from(result), data]);
					}
				});
			}
			stream.on("end", () => resolve(result));
		} else {
			stream.on("finish", () => resolve());
		}
	});
	if (isStream.readable && !options.noCollect) promise.emittedData = result;
	return promise;
};
