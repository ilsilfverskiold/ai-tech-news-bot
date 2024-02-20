/* eslint max-statements: off */

"use strict";

const { resolve } = require("path")
    , PassThru    = require("../utils/pass-thru");

const existingFiles = [
	"/project/foo.js", "/project/other.js", "/project/other/index.js", "/project/samename",
	"/project/samename.js", "/project/samename.json", "/project/dir/subdir/bar.js",
	"/project/dir/lorem.js", "/project/otherdir/esli.js", "/project/node_modules/outer/boo.js",
	"/project/node_modules/outer/raz.js", "/project/node_modules/outer/node_modules/nested/elo.js",
	"/project/node_modules/outer3/index.js"
];
existingFiles.includes = require("es5-ext/array/#/contains");

const existingMains = { "/project/dir": "lorem", "/project/node_modules/outer": "raz" };

const isFile = function (path) {
	path = resolve(path);
	return new PassThru(existingFiles.includes(path) ? path : null);
};

const resolvePackageMain = function (path) {
	return new PassThru(existingMains[resolve(path)] || null);
};

module.exports = function (t, a) {
	const resolver = t([".js", ".json"], isFile, resolvePackageMain);
	a(resolver("/", "elo").value, null);
	a(resolver("/", "foo").value, null);
	a(resolver("/", "outer/boo").value, null);
	a(resolver("/", "./project/foo").value, "/project/foo.js");

	a(resolver("/project", "./foo").value, "/project/foo.js");
	a(resolver("/project", "./foo.js").value, "/project/foo.js");
	a(resolver("/project", "./foo.json").value, null);
	a(resolver("/project", "./other").value, "/project/other.js");
	a(resolver("/project", "./other/").value, "/project/other/index.js");
	a(resolver("/project", "./samename").value, "/project/samename");
	a(resolver("/project", "./samename.js").value, "/project/samename.js");
	a(resolver("/project", "./samename.json").value, "/project/samename.json");
	a(resolver("/project", "./samename").value, "/project/samename");
	a(resolver("/project", "./dir").value, "/project/dir/lorem.js");
	a(resolver("/project", "./dir/lorem").value, "/project/dir/lorem.js");
	a(resolver("/project", "./dir/subdir/bar").value, "/project/dir/subdir/bar.js");
	a(resolver("/project/dir", ".").value, "/project/dir/lorem.js");
	a(resolver("/project/dir", "./").value, "/project/dir/lorem.js");
	a(resolver("/project/dir", "./lorem").value, "/project/dir/lorem.js");
	a(resolver("/project/dir", "../other").value, "/project/other.js");
	a(resolver("/project/dir", "../other/").value, "/project/other/index.js");
	a(resolver("/project/dir/subdir", "../").value, "/project/dir/lorem.js");
	a(resolver("/project/dir/subdir", "../../foo").value, "/project/foo.js");

	a(resolver("/project", "outer").value, "/project/node_modules/outer/raz.js");
	a(resolver("/project", "outer/boo").value, "/project/node_modules/outer/boo.js");
	a(resolver("/project", "outer/boo.json").value, null);
	a(resolver("/project", "outer3").value, "/project/node_modules/outer3/index.js");
	a(resolver("/project", "nested/elo").value, null);
	a(
		resolver("/project/node_modules/outer", "outer3").value,
		"/project/node_modules/outer3/index.js"
	);
	a(resolver("/project/node_modules/outer", "project/foo").value, null);
	a(
		resolver("/project/node_modules/outer", "nested/elo").value,
		"/project/node_modules/outer/node_modules/nested/elo.js"
	);
	a(resolver("/project/node_modules/outer/node_modules/nested", "project/foo").value, null);
	a(
		resolver("/project/node_modules/outer/node_modules/nested", "outer").value,
		"/project/node_modules/outer/raz.js"
	);
	a(
		resolver("/project/node_modules/outer/node_modules/nested", "outer/boo").value,
		"/project/node_modules/outer/boo.js"
	);
	a(
		resolver("/project/node_modules/outer/node_modules/nested", "outer3").value,
		"/project/node_modules/outer3/index.js"
	);
};
