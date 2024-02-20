'use strict';

var normalizeArray = require('../_normalize-array')
  , cwd            = require('./_cwd');

module.exports = function () {
	var resolvedPath = '', resolvedAbsolute = false, i, path;

	for (i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
		path = (i >= 0) ? arguments[i] : cwd;

		// Skip empty and invalid entries
		if (typeof path !== 'string') {
			throw new TypeError('Arguments to path.resolve must be strings');
		}
		if (!path) continue;

		resolvedPath = path + '/' + resolvedPath;
		resolvedAbsolute = path.charAt(0) === '/';
	}

	// At this point the path should be resolved to a full absolute path, but
	// handle relative paths to be safe (might happen when process.cwd() fails)

	// Normalize the path
	resolvedPath = normalizeArray(resolvedPath.split('/').filter(function (p) {
		return !!p;
	}), !resolvedAbsolute).join('/');

	return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};
