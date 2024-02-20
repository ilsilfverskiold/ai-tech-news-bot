'use strict';

module.exports = function (t, a) {
	a.deep('C:\\raz\\dwa\\trzy.js'.match(t).slice(),
		['C:\\raz\\dwa\\trzy.js', 'C:', '\\', 'raz\\dwa\\trzy.js']);
};
