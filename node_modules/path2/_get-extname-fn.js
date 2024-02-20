'use strict';

module.exports = function (splitPath) {
	return function (path) { return splitPath(path)[3]; };
};
