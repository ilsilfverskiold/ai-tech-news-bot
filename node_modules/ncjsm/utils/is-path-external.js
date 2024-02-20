"use strict";

const ensureString = require("type/string/ensure");

module.exports = function (path) {
	let pathChar;
	path = ensureString(path);
	pathChar = path.charAt(0);
	if (pathChar === "/") return false;
	if (pathChar === ".") {
		pathChar = path.charAt(1);
		if (!pathChar || pathChar === "/") return false;
		if (pathChar === ".") {
			pathChar = path.charAt(2);
			if (!pathChar || pathChar === "/") return false;
		}
	}
	return true;
};
