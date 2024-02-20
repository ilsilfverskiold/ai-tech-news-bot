'use strict';

var f = 'C:\\foo\\test\\posix\\test-path.js';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t(f).substr(-10), 'test\\posix');
	a(t('/a/b/'), '/a');
	a(t('/a/b'), '/a');
	a(t('/a'), '/');
	a(t(''), '.');
	a(t('/'), '/');
	a(t('////'), '/');

	a(t('c:\\'), 'c:\\');
	a(t('c:\\foo'), 'c:\\');
	a(t('c:\\foo\\'), 'c:\\');
	a(t('c:\\foo\\bar'), 'c:\\foo');
	a(t('c:\\foo\\bar\\'), 'c:\\foo');
	a(t('c:\\foo\\bar\\baz'), 'c:\\foo\\bar');
	a(t('\\'), '\\');
	a(t('\\foo'), '\\');
	a(t('\\foo\\'), '\\');
	a(t('\\foo\\bar'), '\\foo');
	a(t('\\foo\\bar\\'), '\\foo');
	a(t('\\foo\\bar\\baz'), '\\foo\\bar');
	a(t('c:'), 'c:');
	a(t('c:foo'), 'c:');
	a(t('c:foo\\'), 'c:');
	a(t('c:foo\\bar'), 'c:foo');
	a(t('c:foo\\bar\\'), 'c:foo');
	a(t('c:foo\\bar\\baz'), 'c:foo\\bar');
	a(t('\\\\unc\\share'), '\\\\unc\\share');
	a(t('\\\\unc\\share\\foo'), '\\\\unc\\share\\');
	a(t('\\\\unc\\share\\foo\\'), '\\\\unc\\share\\');
	a(t('\\\\unc\\share\\foo\\bar'),
		'\\\\unc\\share\\foo');
	a(t('\\\\unc\\share\\foo\\bar\\'),
		'\\\\unc\\share\\foo');
	a(t('\\\\unc\\share\\foo\\bar\\baz'),
		'\\\\unc\\share\\foo\\bar');
};
