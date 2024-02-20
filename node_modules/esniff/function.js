"use strict";

var value       = require("es5-ext/object/valid-value")
  , isValue     = require("es5-ext/object/is-value")
  , esniff      = require("./")
  , next        = esniff.next
  , resume      = esniff.resume
  , collectNest = esniff.collectNest;

module.exports = function (name/*, options*/) {
	var length, names, options = Object(arguments[1]), asProperty = false, asPlain = true;
	name = String(value(name));
	names = name.split(".").map(function (prop) {
		prop = prop.trim();
		if (!prop) throw new TypeError(name + " is not valid function name");
		return prop;
	});
	length = names.length;
	if (isValue(options.asProperty)) asProperty = options.asProperty;
	if (isValue(options.asPlain)) asPlain = options.asPlain;
	return function (code) {
		code = String(value(code));
		return esniff(code, names[0][0], function (i, previous) {
			var j = 0, prop;
			if (previous === ".") {
				if (!asProperty) return next();
			} else if (!asPlain) {
				return next();
			}
			while (j < length) {
				prop = names[j];
				if (code.indexOf(prop, i) !== i) return next();
				next(prop.length);
				i = esniff.index;
				++j;
				if (j < length) {
					if (code[i] !== ".") return resume();
					next();
					i = esniff.index;
				}
			}
			if (code[i] !== "(") return resume();
			return collectNest();
		});
	};
};
