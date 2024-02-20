'use strict';

module.exports = require('../is-windows')
	? require('./windows/join').tests : require('./posix/join').tests;
