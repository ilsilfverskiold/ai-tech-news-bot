'use strict';

module.exports = require('../is-windows')
	? require('./windows/dirname').tests : require('./posix/dirname').tests;
