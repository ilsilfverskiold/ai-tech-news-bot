'use strict';

module.exports = require('./is-windows')
	? require('./windows/basename') : require('./posix/basename');
