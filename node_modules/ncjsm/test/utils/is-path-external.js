"use strict";

module.exports = function (t, a) {
	a(t("foo"), true);
	a(t("foo/bar.js"), true);
	a(t("/foo/bar.js"), false);
	a(t("./foo/bar.js"), false);
	a(t("../foo/bar.js"), false);
	a(t(".."), false);
	a(t("."), false);
	a(t("../../"), false);
	a(t(".../sdfsdf/"), true);
};
