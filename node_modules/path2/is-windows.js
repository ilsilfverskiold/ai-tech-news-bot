'use strict';

module.exports = (function () {
	if (typeof process === 'undefined') return false;
	if (!process) return false;
	return (process.platform === 'win32');
}());
