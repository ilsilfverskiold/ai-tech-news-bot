'use strict';

var f = 'test-path.js';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t(f), 'test-path.js');
	a(t(f, '.js'), 'test-path');
	a(t(''), '');
	a(t('/dir/basename.ext'), 'basename.ext');
	a(t('/basename.ext'), 'basename.ext');
	a(t('basename.ext'), 'basename.ext');
	a(t('basename.ext/'), 'basename.ext');
	a(t('basename.ext//'), 'basename.ext');

	a(t('\\dir\\basename.ext'), 'basename.ext');
	a(t('\\basename.ext'), 'basename.ext');
	a(t('basename.ext'), 'basename.ext');
	a(t('basename.ext\\'), 'basename.ext');
	a(t('basename.ext\\\\'), 'basename.ext');
};
