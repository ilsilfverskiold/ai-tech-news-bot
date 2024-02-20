'use strict';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t('/home/foo'), true);
	a(t('/home/foo/..'), true);
	a(t('bar/'), false);
	a(t('./baz'), false);
};
