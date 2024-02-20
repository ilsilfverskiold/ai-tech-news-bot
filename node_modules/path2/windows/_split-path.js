'use strict';

var splitDeviceRe = require('./_split-device-re')

  , splitTailRe =
	/^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

module.exports = function (filename) {
	// Separate device+slash from tail
	var result = splitDeviceRe.exec(filename)
	  , device = (result[1] || '') + (result[2] || ''), tail = result[3] || ''

	// Split the tail into dir, basename and extension
	  , result2 = splitTailRe.exec(tail), dir = result2[1], basename = result2[2]
	  , ext = result2[3];

	return [device, dir, basename, ext];
};
