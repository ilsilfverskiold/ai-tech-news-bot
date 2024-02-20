'use strict';

var cwd = require('../../windows/_cwd')
  , data = [[['c:/blah\\blah', 'd:/games', 'c:../a'], 'c:\\blah\\a'],
		[['c:/ignore', 'd:\\a/b\\c/d', '\\e.exe'], 'd:\\e.exe'],
		[['c:/ignore', 'c:/some/file'], 'c:\\some\\file'],
		[['d:/ignore', 'd:some/dir//'], 'd:\\ignore\\some\\dir'],
		[['.'], cwd],
		[['//server/share', '..', 'relative\\'], '\\\\server\\share\\relative'],
		[['c:/', '//'], 'c:\\'],
		[['c:/', '//dir'], 'c:\\dir'],
		[['c:/', '//server/share'], '\\\\server\\share\\'],
		[['c:/', '//server//share'], '\\\\server\\share\\'],
		[['c:/', '///some//dir'], 'c:\\some\\dir']
	];

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t.apply(null, test[0]), test[1], i);
	});
};
