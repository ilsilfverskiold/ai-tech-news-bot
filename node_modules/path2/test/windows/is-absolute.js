'use strict';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t('//server/file'), true);
	a(t('\\\\server\\file'), true);
	a(t('C:/Users/'), true);
	a(t('C:\\Users\\'), true);
	a(t('C:cwd/another'), false);
	a(t('C:cwd\\another'), false);
	a(t('directory/directory'), false);
	a(t('directory\\directory'), false);
};
