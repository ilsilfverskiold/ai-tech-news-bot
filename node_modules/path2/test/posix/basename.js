'use strict';

var f = 'test-path.js'
  , controlCharFilename = 'Icon' + String.fromCharCode(13);

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

	a(t('\\dir\\basename.ext'), '\\dir\\basename.ext');
	a(t('\\basename.ext'), '\\basename.ext');
	a(t('basename.ext'), 'basename.ext');
	a(t('basename.ext\\'), 'basename.ext\\');
	a(t('basename.ext\\\\'), 'basename.ext\\\\');

	a(t('/a/b/' + controlCharFilename), controlCharFilename);
};
