'use strict';

module.exports = require('../is-windows')
	? require('./windows/basename').tests : require('./posix/basename').tests;
