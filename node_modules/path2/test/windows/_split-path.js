'use strict';

module.exports = function (t, a) {
	a.deep(t('C:\\raz\\dwa\\trzy.js'), ['C:\\', 'raz\\dwa\\', 'trzy.js', '.js']);
};
