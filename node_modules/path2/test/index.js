'use strict';

var indexTest  = require('tad/lib/utils/index-test');

module.exports = indexTest(indexTest.readDir(__dirname + '/../')(function (o) {
	delete o.isWindows;
	delete o.posix;
	delete o.windows;
	return o;
}));
