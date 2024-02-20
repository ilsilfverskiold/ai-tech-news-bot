'use strict';

module.exports = require('../is-windows')
	? require('./windows/resolve').tests : require('./posix/resolve').tests;
