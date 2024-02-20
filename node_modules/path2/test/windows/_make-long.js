'use strict';

var file = 'C:\\raz\\dwa\\a.js';

module.exports = function (t, a) {
	a('\\\\?\\' + file, t(file));
	a('\\\\?\\' + file, t('\\\\?\\' + file));
	a('\\\\?\\UNC\\someserver\\someshare\\somefile',
		t('\\\\someserver\\someshare\\somefile'));
	a('\\\\?\\UNC\\someserver\\someshare\\somefile',
		t('\\\\?\\UNC\\someserver\\someshare\\somefile'));
	a('\\\\.\\pipe\\somepipe',
		t('\\\\.\\pipe\\somepipe'));

	a(t(null), null);
	a(t(100), 100);
	a(t(exports), exports);
	a(t(false), false);
	a(t(true), true);
};
