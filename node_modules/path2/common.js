'use strict';

module.exports = require('./is-windows')
	? require('./windows/common') : require('./posix/common');
