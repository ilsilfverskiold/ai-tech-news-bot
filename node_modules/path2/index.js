'use strict';

module.exports = require('./is-windows')
	? require('./windows') : require('./posix');
