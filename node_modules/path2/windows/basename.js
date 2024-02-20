'use strict';

var splitPath = require('./_split-path');

module.exports = function (path, ext) {
	var f = splitPath(path)[2];
	if (ext && f.substr(-1 * ext.length).toLowerCase() === ext.toLowerCase()) {
		f = f.substr(0, f.length - ext.length);
	}
	return f;
};
