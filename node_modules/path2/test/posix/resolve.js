'use strict';

var cwd = require('../../posix/_cwd')
  , data = [[['/var/lib', '../', 'file/'], '/var/file'],
	[['/var/lib', '/../', 'file/'], '/file'],
	[['a/b/c/', '../../..'], cwd],
	[['.'], cwd],
	[['/some/dir', '.', '/absolute/'], '/absolute']];

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t.apply(null, test[0]), test[1], i);
	});
};
