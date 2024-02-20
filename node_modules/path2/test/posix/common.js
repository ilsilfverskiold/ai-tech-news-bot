'use strict';

var data = [[['/'], '/'],
	[['/raz/dwa/'], '/raz/dwa'],
	[['/raz/dwa'], '/raz'],
	[['/raz/dwa', '/trzy/cztery'], '/'],
	[['/raz/dwa', '/raz/trzy'], '/raz'],
	[['/raz/dwa', '/raz/dwa/trzy', '/raz/cztery'], '/raz'],
	[['/raz/dwa/piec', '/raz/dwa/trzy', '/raz/dwa/cztery'], '/raz/dwa'],
	[['/raz/dwa/piec', '/raz/dwa/trzy', '/raz/dwa/'], '/raz/dwa'],
	[['/raz/dwa/piec', '/raz/dwa/trzy', '/raz/dwa'], '/raz'],
	[['/raz/dwa/trzy', '/raz/dwatrzy'], '/raz']];

module.exports = exports = function (t, a) { exports.tests(t, a); };

exports.tests = function (t, a) {
	data.forEach(function (test, i) {
		a(t.apply(null, test[0]), test[1], i);
	});
};
