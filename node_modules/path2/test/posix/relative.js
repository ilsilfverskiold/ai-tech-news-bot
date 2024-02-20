'use strict';

var data = [['/var/lib', '/var', '..'],
	['/var/lib', '/bin', '../../bin'],
	['/var/lib', '/var/lib', ''],
	['/var/lib', '/var/apache', '../apache'],
	['/var/', '/var/lib', 'lib'],
	['/', '/var/lib', 'var/lib']];

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t(test[0], test[1]), test[2], i);
	});
};
