'use strict';

var isAbsolute       = require('./is-absolute')
  , normalizeUNCRoot = require('./_normalize-unc-root')
  , splitDeviceRe    = require('./_split-device-re')
  , cwd              = require('./_cwd')
  , normalizeArray   = require('../_normalize-array');

module.exports = function () {
	var resolvedDevice = '', resolvedTail = '', resolvedAbsolute = false, i, path
	  , result, device, isUnc, isAbs, tail;

	for (i = arguments.length - 1; i >= -1; i--) {
		if (i >= 0) {
			path = arguments[i];
		} else if (!resolvedDevice) {
			path = cwd;
		} else {
			// Windows has the concept of drive-specific current working
			// directories. If we've resolved a drive letter but not yet an
			// absolute path, get cwd for that drive. We're sure the device is not
			// an unc path at this points, because unc paths are always absolute.
			path = process.env['=' + resolvedDevice];
			// Verify that a drive-local cwd was found and that it actually points
			// to our drive. If not, default to the drive's root.
			if (!path || (path.substr(0, 3).toLowerCase() !==
					resolvedDevice.toLowerCase() + '\\')) {
				path = resolvedDevice + '\\';
			}
		}

		// Skip empty and invalid entries
		path = String(path);
		if (!path) continue;

		result = splitDeviceRe.exec(path);
		device = result[1] || '';
		isUnc = device && device.charAt(1) !== ':';
		isAbs = isAbsolute(path);
		tail = result[3];

		if (device && resolvedDevice &&
				(device.toLowerCase() !== resolvedDevice.toLowerCase())) {
			// This path points to another device so it is not applicable
			continue;
		}

		if (!resolvedDevice) {
			resolvedDevice = device;
		}
		if (!resolvedAbsolute) {
			resolvedTail = tail + '\\' + resolvedTail;
			resolvedAbsolute = isAbs;
		}

		if (resolvedDevice && resolvedAbsolute) {
			break;
		}
	}

	// Convert slashes to backslashes when `resolvedDevice` points to an UNC
	// root. Also squash multiple slashes into a single one where appropriate.
	if (isUnc) {
		resolvedDevice = normalizeUNCRoot(resolvedDevice);
	}

	// At this point the path should be resolved to a full absolute path,
	// but handle relative paths to be safe (might happen when process.cwd()
	// fails)

	// Normalize the tail path

	function f(p) {
		return !!p;
	}

	resolvedTail = normalizeArray(resolvedTail.split(/[\\\/]+/).filter(f),
		!resolvedAbsolute).join('\\');

	return (resolvedDevice + (resolvedAbsolute ? '\\' : '') + resolvedTail) ||
		'.';
};
