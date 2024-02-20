"use strict";

module.exports = function (T, a) {
	const passThru = new T("foo");
	a(passThru.value, "foo");
	a(passThru.then(value => `${ value }bar`).value, "foobar");
};
