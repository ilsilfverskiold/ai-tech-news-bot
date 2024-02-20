'use strict';

var isAbsolute     = require('./is-absolute')
  , normalizeArray = require('../_normalize-array');

module.exports = function (path) {
	var isAbs = isAbsolute(path), trailingSlash = path[path.length - 1] === '/',
	segments = path.split('/'), nonEmptySegments = [], i;

	// Normalize the path
	for (i = 0; i < segments.length; i++) {
		if (segments[i]) {
			nonEmptySegments.push(segments[i]);
		}
	}
	path = normalizeArray(nonEmptySegments, !isAbs).join('/');

	if (!path && !isAbs) {
		path = '.';
	}
	if (path && trailingSlash) {
		path += '/';
	}

	return (isAbs ? '/' : '') + path;
};
