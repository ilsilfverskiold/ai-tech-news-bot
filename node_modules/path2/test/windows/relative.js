'use strict';

var data = [['c:/blah\\blah', 'd:/games', 'd:\\games'],
	['c:/aaaa/bbbb', 'c:/aaaa', '..'],
	['c:/aaaa/bbbb', 'c:/cccc', '..\\..\\cccc'],
	['c:/aaaa/bbbb', 'c:/aaaa/bbbb', ''],
	['c:/aaaa/bbbb', 'c:/aaaa/cccc', '..\\cccc'],
	['c:/aaaa/', 'c:/aaaa/cccc', 'cccc'],
	['c:/', 'c:\\aaaa\\bbbb', 'aaaa\\bbbb'],
	['c:/aaaa/bbbb', 'd:\\', 'd:\\']];

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t(test[0], test[1]), test[2], i);
	});
};
