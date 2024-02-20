"use strict";

var value        = require("es5-ext/object/valid-value")
  , identStart   = require("./lib/ident-start-pattern")
  , identNext    = require("./lib/ident-next-pattern")
  , esniff       = require("./")
  , next         = esniff.next
  , resume       = esniff.resume
  , reIdentStart = new RegExp("[" + identStart + "]")
  , reIdentNext  = new RegExp("[" + identStart + identNext + "]");

module.exports = function (objName) {
	var length;
	objName = String(value(objName));
	length = objName.length;
	if (!length) throw new TypeError(objName + " is not valid object name");
	return function (code) {
		var data = [];
		code = String(value(code));
		esniff(code, objName[0], function (i, previous) {
			var name, startIndex, char;
			if (previous === ".") return next();
			if (code.indexOf(objName, i) !== i) return next();
			next(length);
			i = esniff.index;
			if (code[i] !== ".") return resume();
			next();
			startIndex = i = esniff.index;
			name = "";
			if (!reIdentStart.test((char = code[i]))) return resume();
			name += char;
			while ((char = code[++i]) && reIdentNext.test(char)) name += char;
			data.push({ name: name, start: startIndex, end: i });
			return next(i - startIndex);
		});
		return data;
	};
};
