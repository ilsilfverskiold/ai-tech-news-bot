'use strict';

module.exports = require('./is-windows')
	? require('./windows/normalize') : require('./posix/normalize');
