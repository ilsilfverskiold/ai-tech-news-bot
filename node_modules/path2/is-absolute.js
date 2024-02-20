'use strict';

module.exports = require('./is-windows')
	? require('./windows/is-absolute') : require('./posix/is-absolute');
