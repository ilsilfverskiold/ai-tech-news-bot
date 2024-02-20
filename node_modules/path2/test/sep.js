'use strict';

module.exports = require('../is-windows')
	? require('./windows/sep').tests : require('./posix/sep').tests;
