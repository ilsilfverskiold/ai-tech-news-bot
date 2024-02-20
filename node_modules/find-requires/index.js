"use strict";

const ensureString = require("es5-ext/object/validate-stringifiable-value")
    , isObject     = require("es5-ext/object/is-object")
    , isValue      = require("es5-ext/object/is-value")
    , esniff       = require("esniff/function")("require");

module.exports = function (code, options = {}) {
	code = ensureString(code);
	if (!isObject(options)) options = {};
	const setupCode = isValue(options.setupCode) ? ensureString(options.setupCode) : ""
	    , deps = esniff(code);
	deps.forEach(data => {
		let requirePath;
		try { requirePath = new Function(`${ setupCode }; return (${ data.raw });`)(); }
		catch (ignore) {}
		if (typeof requirePath === "number") requirePath = String(requirePath);
		if (typeof requirePath === "string") data.value = requirePath;
	});
	return options.raw ? deps : deps.map(dep => dep.value).filter(Boolean);
};
