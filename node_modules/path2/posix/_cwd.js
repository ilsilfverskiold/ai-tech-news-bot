'use strict';

var isWindows = require('../is-windows');

module.exports = (function () {
	if (isWindows) return '/';
	if (typeof process === 'undefined') return '/';
	if (!process) return '/';
	if (typeof process.cwd !== 'function') return '/';
	return process.cwd();
}());
