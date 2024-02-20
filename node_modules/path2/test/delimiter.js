'use strict';

module.exports = require('../is-windows')
	? require('./windows/delimiter').tests : require('./posix/delimiter').tests;
