'use strict';

module.exports = require('./is-windows')
	? require('./windows/relative') : require('./posix/relative');
