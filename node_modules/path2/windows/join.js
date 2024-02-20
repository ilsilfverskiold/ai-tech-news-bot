'use strict';

var normalize = require('./normalize');

module.exports = function () {
	var paths, joined, f;

	f = function (p) {
		if (typeof p !== 'string') {
			throw new TypeError('Arguments to path.join must be strings');
		}
		return p;
	};

	paths = Array.prototype.filter.call(arguments, f);
	joined = paths.join('\\');

	// Make sure that the joined path doesn't start with two slashes, because
	// normalize() will mistake it for an UNC path then.
	//
	// This step is skipped when it is very clear that the user actually
	// intended to point at an UNC path. This is assumed when the first
	// non-empty string arguments starts with exactly two slashes followed by
	// at least one more non-slash character.
	//
	// Note that for normalize() to treat a path as an UNC path it needs to
	// have at least 2 components, so we don't filter for that here.
	// This means that the user can use join to construct UNC paths from
	// a server name and a share name; for example:
	//   path.join('//server', 'share') -> '\\\\server\\share\')
	if (!/^[\\\/]{2}[^\\\/]/.test(paths[0])) {
		joined = joined.replace(/^[\\\/]{2,}/, '\\');
	}

	return normalize(joined);
};
