'use strict';

module.exports = require('../is-windows')
	? require('./windows/is-absolute').tests
	: require('./posix/is-absolute').tests;
