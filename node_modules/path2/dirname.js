'use strict';

module.exports = require('./is-windows')
	? require('./windows/dirname') : require('./posix/dirname');
