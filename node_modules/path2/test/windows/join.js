'use strict';

module.exports = exports = function (t, a) { exports.tests(t, a); };

var data = exports.data = require('../posix/join').data.concat([
	// UNC path expected
	[['//foo/bar'], '//foo/bar/'],
	[['\\/foo/bar'], '//foo/bar/'],
	[['\\\\foo/bar'], '//foo/bar/'],
	// UNC path expected - server and share separate
	[['//foo', 'bar'], '//foo/bar/'],
	[['//foo/', 'bar'], '//foo/bar/'],
	[['//foo', '/bar'], '//foo/bar/'],
	// UNC path expected - questionable
	[['//foo', '', 'bar'], '//foo/bar/'],
	[['//foo/', '', 'bar'], '//foo/bar/'],
	[['//foo/', '', '/bar'], '//foo/bar/'],
	// UNC path expected - even more questionable
	[['', '//foo', 'bar'], '//foo/bar/'],
	[['', '//foo/', 'bar'], '//foo/bar/'],
	[['', '//foo/', '/bar'], '//foo/bar/'],
	// No UNC path expected (no double slash in first component)
	[['\\', 'foo/bar'], '/foo/bar'],
	[['\\', '/foo/bar'], '/foo/bar'],
	[['', '/', '/foo/bar'], '/foo/bar'],
	// No UNC path expected (no non-slashes in first component - questionable)
	[['//', 'foo/bar'], '/foo/bar'],
	[['//', '/foo/bar'], '/foo/bar'],
	[['\\\\', '/', '/foo/bar'], '/foo/bar'],
	[['//'], '/'],
	// No UNC path expected (share name missing - questionable).
	[['//foo'], '/foo'],
	[['//foo/'], '/foo/'],
	[['//foo', '/'], '/foo/'],
	[['//foo', '', '/'], '/foo/'],
	// No UNC path expected (too many leading slashes - questionable)
	[['///foo/bar'], '/foo/bar'],
	[['////foo', 'bar'], '/foo/bar'],
	[['\\\\\\/foo/bar'], '/foo/bar'],
	// Drive-relative vs drive-absolute paths. This merely describes the
	// status quo, rather than being obviously right
	[['c:'], 'c:.'],
	[['c:.'], 'c:.'],
	[['c:', ''], 'c:.'],
	[['', 'c:'], 'c:.'],
	[['c:.', '/'], 'c:./'],
	[['c:.', 'file'], 'c:file'],
	[['c:', '/'], 'c:/'],
	[['c:', 'file'], 'c:/file']
]);

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t.apply(null, test[0]), test[1].replace(/\//g, '\\'), i);
	});
};
