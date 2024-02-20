"use strict";

module.exports = function (t, a) {
	const pathA   = "./__playground/other"
	    , pathB   = "./__playground/samename"
	    , moduleA = require(pathA);

	let moduleA2;

	const innerModuleB = t([require.resolve(pathA), require.resolve(pathB)], () => {
		moduleA2 = require(pathA);
		a.not(moduleA2, moduleA);
		return require(pathB);
	});

	const moduleB = require(pathB);
	a(require(pathA), moduleA);
	a.not(moduleB, innerModuleB);

	t([require.resolve(pathA), require.resolve(pathB)], () => {
		const moduleA3 = require(pathA);
		a.not(moduleA3, moduleA);
		a.not(moduleA3, moduleA2);
		const moduleB3 = require(pathB);
		a.not(moduleB3, moduleB);
	});

	a(require(pathA), moduleA);
	a(require(pathB), moduleB);

	t(() => {
		const moduleA3 = require(pathA);
		a.not(moduleA3, moduleA);
		a.not(moduleA3, moduleA2);
		const moduleB3 = require(pathB);
		a.not(moduleB3, moduleB);
	});
};
