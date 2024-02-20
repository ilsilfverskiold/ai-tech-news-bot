'use strict';

var data = [[['C:\\'], 'C:\\'],
	[['d:\\'], 'd:\\'],
	[['c:\\', 'd:\\'], null],
	[['c:\\raz\\dwa\\'], 'c:\\raz\\dwa'],
	[['C:\\raZ\\dwa'], 'C:\\raZ'],
	[['c:\\raz\\dwa', 'c:\\trzy\\cztery'], 'c:\\'],
	[['c:\\raz\\dwa', 'c:\\raz\\trzy'], 'c:\\raz'],
	[['c:\\raZ\\dwa', 'c:\\rAz\\trzy'], 'c:\\raZ'],
	[['c:\\raz\\dwa', 'c:\\raz\\dwa\\trzy', 'c:\\raz\\cztery'], 'c:\\raz'],
	[['C:\\raz\\dwa\\piec', 'c:\\raz\\dwa\\trzy', 'c:\\raz\\dwa\\cztery'],
		'C:\\raz\\dwa'],
	[['C:\\raz\\dwa\\piec', 'c:\\raz\\dwa\\trzy', 'c:\\raz\\dwa\\'],
		'C:\\raz\\dwa'],
	[['c:\\raz\\dwa\\piec', 'c:\\raz\\dwa\\trzy', 'c:\\raz\\dwa'],
		'c:\\raz'],
	[['c:\\raz\\dwa\\trzy', 'c:\\raz\\dwatrzy'], 'c:\\raz']];

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t.apply(null, test[0]), test[1], i);
	});
};
