'use strict';

module.exports = function (splitPath) {
	return function (path) {
		var result = splitPath(path),
		root = result[0],
		dir = result[1];

		if (!root && !dir) {
			// No dirname whatsoever
			return '.';
		}

		if (dir) {
			// It has a dirname, strip trailing slash
			dir = dir.substr(0, dir.length - 1);
		}

		return root + dir;
	};
};
