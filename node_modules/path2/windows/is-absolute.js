'use strict';

var splitDeviceRe = require('./_split-device-re');

module.exports = function (path) {
	var result = splitDeviceRe.exec(path), device = result[1] || ''
	  , isUnc = device && device.charAt(1) !== ':';

	// UNC paths are always absolute
	return !!result[2] || isUnc || false;
};
