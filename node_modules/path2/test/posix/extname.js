'use strict';

var f = 'test-path.js';

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	a(t(f), '.js');

	a(t(''), '');
	a(t('/path/to/file'), '');
	a(t('/path/to/file.ext'), '.ext');
	a(t('/path.to/file.ext'), '.ext');
	a(t('/path.to/file'), '');
	a(t('/path.to/.file'), '');
	a(t('/path.to/.file.ext'), '.ext');
	a(t('/path/to/f.ext'), '.ext');
	a(t('/path/to/..ext'), '.ext');
	a(t('file'), '');
	a(t('file.ext'), '.ext');
	a(t('.file'), '');
	a(t('.file.ext'), '.ext');
	a(t('/file'), '');
	a(t('/file.ext'), '.ext');
	a(t('/.file'), '');
	a(t('/.file.ext'), '.ext');
	a(t('.path/file.ext'), '.ext');
	a(t('file.ext.ext'), '.ext');
	a(t('file.'), '.');
	a(t('.'), '');
	a(t('./'), '');
	a(t('.file.ext'), '.ext');
	a(t('.file'), '');
	a(t('.file.'), '.');
	a(t('.file..'), '.');
	a(t('..'), '');
	a(t('../'), '');
	a(t('..file.ext'), '.ext');
	a(t('..file'), '.file');
	a(t('..file.'), '.');
	a(t('..file..'), '.');
	a(t('...'), '.');
	a(t('...ext'), '.ext');
	a(t('....'), '.');
	a(t('file.ext/'), '.ext');
	a(t('file.ext//'), '.ext');
	a(t('file/'), '');
	a(t('file//'), '');
	a(t('file./'), '.');
	a(t('file.//'), '.');

	a(t('.\\'), '');
	a(t('..\\'), '.\\');
	a(t('file.ext\\'), '.ext\\');
	a(t('file.ext\\\\'), '.ext\\\\');
	a(t('file\\'), '');
	a(t('file\\\\'), '');
	a(t('file.\\'), '.\\');
	a(t('file.\\\\'), '.\\\\');
};
