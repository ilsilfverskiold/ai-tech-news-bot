"use strict";

const toThenable = require("2-thenable")
    , toPromise  = require("./to-promise");

module.exports = stream => {
	const promise = toPromise(stream);
	return Object.defineProperty(toThenable(stream, promise), "emittedData", {
		configurable: true,
		enumerable: true,
		get: () => promise.emittedData
	});
};
