'use strict';

module.exports = require('../is-windows')
	? require('./windows/normalize').tests : require('./posix/normalize').tests;
