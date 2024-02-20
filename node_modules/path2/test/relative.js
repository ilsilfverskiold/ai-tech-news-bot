'use strict';

module.exports = require('../is-windows')
	? require('./windows/relative').tests : require('./posix/relative').tests;
