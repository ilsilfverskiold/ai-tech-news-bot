'use strict';

var f = '/foo/test/posix/test-path.js';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t(f).substr(-10), 'test/posix');
	a(t('/a/b/'), '/a');
	a(t('/a/b'), '/a');
	a(t('/a'), '/');
	a(t(''), '.');
	a(t('/'), '/');
	a(t('////'), '/');
};
