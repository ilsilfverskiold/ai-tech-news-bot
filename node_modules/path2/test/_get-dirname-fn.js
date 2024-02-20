'use strict';

module.exports = function (t, a) {
	t = t(require('../posix/_split-path'));
	a(t('/a/b/'), '/a');
};
