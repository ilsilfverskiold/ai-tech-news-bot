"use strict";

const ensureObject  = require("es5-ext/object/valid-object")
    , isThenable    = require("es5-ext/object/is-thenable")
    , ensurePromise = require("es5-ext/object/ensure-promise")
    , finallyMethod = require("es5-ext/promise/#/finally")
    , toShortString = require("es5-ext/to-short-string-representation")
    , d             = require("d");

module.exports = (target, promise) => {
	if (isThenable(ensureObject(target))) {
		throw new TypeError(`${ toShortString(target) } is already a thenable`);
	}
	if ("then" in target) {
		throw new TypeError(`${ toShortString(target) } already has 'then' property`);
	}
	if ("catch" in target) {
		throw new TypeError(`${ toShortString(target) } already has 'catch' property`);
	}
	if ("finally" in target) {
		throw new TypeError(`${ toShortString(target) } already has 'finally' property`);
	}
	ensurePromise(promise);

	return Object.defineProperties(target, {
		then: d(promise.then.bind(promise)),
		catch: d(promise.catch.bind(promise)),
		finally: d(finallyMethod.bind(promise))
	});
};
