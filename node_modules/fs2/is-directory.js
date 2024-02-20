"use strict";

var lstat = require("./lstat").lstat;

module.exports = function (path/*, callback*/) {
	return lstat(path, { loose: true })(function (stats) {
		if (stats) return stats.isDirectory();
		return null;
	}).cb(arguments[1]);
};
module.exports.returnsPromise = true;
