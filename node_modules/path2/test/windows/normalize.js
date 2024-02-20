'use strict';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t('./fixtures///b/../b/c.js'),
		'fixtures\\b\\c.js');
	a(t('/foo/../../../bar'), '\\bar');
	a(t('a//b//../b'), 'a\\b');
	a(t('a//b//./c'), 'a\\b\\c');
	a(t('a//b//.'), 'a\\b');
	a(t('//server/share/dir/file.ext'),
		'\\\\server\\share\\dir\\file.ext');
};
