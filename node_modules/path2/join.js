'use strict';

module.exports = require('./is-windows')
	? require('./windows/join') : require('./posix/join');
