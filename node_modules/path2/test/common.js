'use strict';

module.exports = require('../is-windows')
	? require('./windows/common').tests : require('./posix/common').tests;
