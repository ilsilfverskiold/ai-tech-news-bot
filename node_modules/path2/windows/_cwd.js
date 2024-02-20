'use strict';

var isWindows = require('../is-windows');

module.exports = (function () {
	if (typeof process === 'undefined') return 'C:\\';
	if (!process) return 'C:\\';
	if (typeof process.cwd !== 'function') return 'C:\\';
	if (!isWindows) return 'C:\\';
	return process.cwd();
}());
