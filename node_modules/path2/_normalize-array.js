// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)

'use strict';

module.exports = function normalizeArray(parts, allowAboveRoot) {
	// if the path tries to go above the root, `up` ends up > 0
	var up = 0, i, last;
	for (i = parts.length - 1; i >= 0; i--) {
		last = parts[i];
		if (last === '.') {
			parts.splice(i, 1);
		} else if (last === '..') {
			parts.splice(i, 1);
			up++;
		} else if (up) {
			parts.splice(i, 1);
			up--;
		}
	}

	// if the path is allowed to go above the root, restore leading ..s
	if (allowAboveRoot) {
		for (up; up--; up) {
			parts.unshift('..');
		}
	}

	return parts;
};
