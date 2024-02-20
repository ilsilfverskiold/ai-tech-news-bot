'use strict';

module.exports = require('../is-windows')
	? require('./windows/extname').tests : require('./posix/extname').tests;
