'use strict';

module.exports = require('./is-windows')
	? require('./windows/sep') : require('./posix/sep');
