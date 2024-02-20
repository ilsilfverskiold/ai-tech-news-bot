'use strict';

module.exports = function (t, a) {
	a.deep(t('/raz/dwa/trzy.js'), ['/', 'raz/dwa/', 'trzy.js', '.js']);
};
