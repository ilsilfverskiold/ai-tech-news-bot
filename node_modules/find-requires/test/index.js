"use strict";

const { resolve }  = require("path")
    , { readFile } = require("fs");

const pg = resolve(__dirname, "__playground");

module.exports = function (t, a, d) {
	const result = [
		"one", "12", "thr/ee", "fo\\ur", "five", "six", "seven", "nine", "ten", "elevensplitpath",
		"twelve", "fourteen", "fifteen", "sixteen", "seventeen", "'eighteen'", "nineteen", "twenty",
		"elo", "twenty/one", "twenty/two", "twenty/three", "/twenty/two/2/", "twenty/three/2/",
		"twenty/four/2/'", "twenty/five/2/\"", "'twenty/seven'", "\"twenty/eight",
		"\"twenty/nine\"", "\"thirty\"", "mid-thirty", "marko", "thirty\tbreak-line \tone",
		"elo/setup-code-test", "thirty\two"
	];

	const setupCode = "foo = 'elo'";

	readFile(`${ pg }/edge.js`, "utf-8", (err, str) => {
		let astR;
		if (err) {
			d(err);
			return;
		}
		a.deep(t(str, { setupCode }), result, "Plain result");

		d({
			"Raw option": a => {
				astR = t(str, { raw: true, setupCode });
				a(astR[0].value, "one", "Value");
				a(astR[0].point, 9, "Point");
				a(astR[0].line, 1, "Line");
				a(astR[0].column, 9, "Column");
				a(astR[0].raw, "'on\\u0065'", "Raw");
			}
		});
	});
};
