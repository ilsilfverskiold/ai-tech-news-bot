'use strict';

module.exports = require('./is-windows')
	? require('./windows/resolve') : require('./posix/resolve');
