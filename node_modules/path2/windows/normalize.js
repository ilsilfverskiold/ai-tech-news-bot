'use strict';

var isAbsolute       = require('./is-absolute')
  , normalizeUNCRoot = require('./_normalize-unc-root')
  , splitDeviceRe    = require('./_split-device-re')
  , normalizeArray   = require('../_normalize-array');

module.exports = function (path) {
	var result = splitDeviceRe.exec(path), device = result[1] || ''
	  , isUnc = device && device.charAt(1) !== ':', isAbs = isAbsolute(path)
	  , tail = result[3], trailingSlash = /[\\\/]$/.test(tail);

	// If device is a drive letter, we'll normalize to lower case.
	if (device && device.charAt(1) === ':') {
		device = device[0].toLowerCase() + device.substr(1);
	}

	// Normalize the tail path
	tail = normalizeArray(tail.split(/[\\\/]+/).filter(function (p) {
		return !!p;
	}), !isAbs).join('\\');

	if (!tail && !isAbs) {
		tail = '.';
	}
	if (tail && trailingSlash) {
		tail += '\\';
	}

	// Convert slashes to backslashes when `device` points to an UNC root.
	// Also squash multiple slashes into a single one where appropriate.
	if (isUnc) {
		device = normalizeUNCRoot(device);
	}

	return device + (isAbs ? '\\' : '') + tail;
};
