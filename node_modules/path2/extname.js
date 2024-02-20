'use strict';

module.exports = require('./is-windows')
	? require('./windows/extname') : require('./posix/extname');
