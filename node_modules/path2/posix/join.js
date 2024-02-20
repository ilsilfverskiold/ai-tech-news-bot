'use strict';

var normalize = require('./normalize');

module.exports = function () {
	var path = '', i, segment;
	for (i = 0; i < arguments.length; i++) {
		segment = arguments[i];
		if (typeof segment !== 'string') {
			throw new TypeError('Arguments to path.join must be strings');
		}
		if (segment) {
			if (!path) {
				path += segment;
			} else {
				path += '/' + segment;
			}
		}
	}
	return normalize(path);
};
