"use strict";

const deferred    = require("deferred")
    , { resolve } = require("path");

const playgroundDir = resolve(__dirname, "__playground");

module.exports = function (t, a, d) {
	deferred(
		t(playgroundDir)(value => { a(value, true, "node_modules"); }),
		t(resolve(playgroundDir, "otherdir"))(value => { a(value, false, "Empty"); }),
		t(resolve(playgroundDir, "dir"))(value => { a(value, true, "package.json"); }),
		t(resolve(playgroundDir, "node_modules/outer"))(value => {
			a(value, true, "package.json and node_modules");
		}),
		t(resolve(playgroundDir, "node_modules/outer3"))(value => {
			a(value, false, "In node_modules");
		})
	).done(() => { d(); }, d);
};
