'use strict';

module.exports = function (device) {
	return '\\\\' + device.replace(/^[\\\/]+/, '').replace(/[\\\/]+/g, '\\');
};
