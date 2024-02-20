"use strict";

const { resolve } = require("path");

const pg = resolve(__dirname, "../__playground/is-module-not-found-error");

module.exports = function (t, a) {
	let path;
	try {
		require((path = "./wrong/path"));
		a.never("Wrong path");
	} catch (e) {
		a(t(e, path), true, "Wrong path");
	}
	try {
		require((path = `${ pg }/sample-error`));
		a.never("Evaluation error");
	} catch (e2) {
		a(t(e2, path), false, "Syntax error");
	}
};
