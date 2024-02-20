'use strict';

var resolve = require('./resolve');

module.exports = function (path) {
	// Note: this will *probably* throw somewhere.
	if (typeof path !== 'string') return path;

	if (!path) {
		return '';
	}

	var resolvedPath = resolve(path);

	if (/^[a-zA-Z]\:\\/.test(resolvedPath)) {
		// path is local filesystem path, which needs to be converted
		// to long UNC path.
		return '\\\\?\\' + resolvedPath;
	}
	if (/^\\\\[^?.]/.test(resolvedPath)) {
		// path is network UNC path, which needs to be converted
		// to long UNC path.
		return '\\\\?\\UNC\\' + resolvedPath.substring(2);
	}

	return path;
};
