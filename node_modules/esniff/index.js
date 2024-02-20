"use strict";

var from              = require("es5-ext/array/from")
  , primitiveSet      = require("es5-ext/object/primitive-set")
  , value             = require("es5-ext/object/valid-value")
  , isValue           = require("es5-ext/object/is-value")
  , callable          = require("es5-ext/object/valid-callable")
  , d                 = require("d")
  , eolSet            = require("./lib/ws-eol")
  , wsSet             = require("./lib/ws")
  , objHasOwnProperty = Object.prototype.hasOwnProperty
  , preRegExpSet      = primitiveSet.apply(null, from(";{=([,<>+-*/%&|^!~?:}"))
  , nonNameSet        = primitiveSet.apply(null, from(";{=([,<>+-*/%&|^!~?:})]."));

var move, startCollect, endCollect, collectNest, $ws, $common, $string, $comment, $multiComment
  , $regExp, i, char, line, columnIndex, afterWs, previousChar, nest, nestedTokens, results
  , userCode, userTriggerChar, isUserTriggerOperatorChar, userCallback, quote, collectIndex, data
  , nestRelease, handleEol;

handleEol = function () {
	if (char === "\r" && userCode[i + 1] === "\n") ++i;
	columnIndex = i + 1;
	++line;
};

move = function (j) {
	if (!char) return;
	if (i >= j) return;
	while (i < j) {
		if (!char) return;
		if (objHasOwnProperty.call(wsSet, char)) {
			if (objHasOwnProperty.call(eolSet, char)) handleEol();
		} else {
			previousChar = char;
		}
		char = userCode[++i];
	}
};

startCollect = function (oldNestRelease) {
	var isNewLine = objHasOwnProperty.call(eolSet, userCode[i]);
	if (isValue(collectIndex)) nestedTokens.push([data, collectIndex, oldNestRelease]);
	data = {
		point: i + 1,
		line: isNewLine ? line + 1 : line,
		column: isNewLine ? 0 : i + 1 - columnIndex
	};
	collectIndex = i;
};

endCollect = function () {
	var previous;
	data.raw = userCode.slice(collectIndex, i);
	results.push(data);
	if (nestedTokens.length) {
		previous = nestedTokens.pop();
		data = previous[0];
		collectIndex = previous[1];
		nestRelease = previous[2];
		return;
	}
	data = null;
	collectIndex = null;
	nestRelease = null;
};

collectNest = function () {
	var old = nestRelease;
	nestRelease = nest;
	++nest;
	move(i + 1);
	startCollect(old);
	return $ws;
};

$common = function () {
	if (char === "'" || char === "\"") {
		quote = char;
		char = userCode[++i];
		return $string;
	}
	if (char === "(" || char === "{" || char === "[") {
		++nest;
	} else if (char === ")" || char === "}" || char === "]") {
		if (nestRelease === --nest) endCollect();
	} else if (char === "/") {
		if (objHasOwnProperty.call(preRegExpSet, previousChar)) {
			char = userCode[++i];
			return $regExp;
		}
	}
	if (
		char !== userTriggerChar ||
		(!isUserTriggerOperatorChar &&
			previousChar &&
			!afterWs &&
			!objHasOwnProperty.call(nonNameSet, previousChar))
	) {
		previousChar = char;
		char = userCode[++i];
		return $ws;
	}

	return userCallback(i, previousChar, nest);
};

$comment = function () {
	while (char) {
		if (objHasOwnProperty.call(eolSet, char)) {
			handleEol();
			return;
		}
		char = userCode[++i];
	}
};

$multiComment = function () {
	while (char) {
		if (char === "*") {
			char = userCode[++i];
			if (char === "/") return;
			continue;
		}
		if (objHasOwnProperty.call(eolSet, char)) handleEol();
		char = userCode[++i];
	}
};

$ws = function () {
	var next;
	afterWs = false;
	while (char) {
		if (objHasOwnProperty.call(wsSet, char)) {
			afterWs = true;
			if (objHasOwnProperty.call(eolSet, char)) handleEol();
		} else if (char === "/") {
			next = userCode[i + 1];
			if (next === "/") {
				char = userCode[(i += 2)];
				afterWs = true;
				$comment();
			} else if (next === "*") {
				char = userCode[(i += 2)];
				afterWs = true;
				$multiComment();
			} else {
				break;
			}
		} else {
			break;
		}
		char = userCode[++i];
	}
	if (!char) return null;
	return $common;
};

$string = function () {
	while (char) {
		if (char === quote) {
			char = userCode[++i];
			previousChar = quote;
			return $ws;
		}
		if (char === "\\") {
			if (objHasOwnProperty.call(eolSet, userCode[++i])) handleEol();
		}
		char = userCode[++i];
	}
	return null;
};

$regExp = function () {
	while (char) {
		if (char === "/") {
			previousChar = "/";
			char = userCode[++i];
			return $ws;
		}
		if (char === "\\") ++i;
		char = userCode[++i];
	}
	return null;
};

module.exports = exports = function (code, triggerChar, callback) {
	var state;

	userCode = String(value(code));
	userTriggerChar = String(value(triggerChar));
	if (userTriggerChar.length !== 1) {
		throw new TypeError(userTriggerChar + " should be one character long string");
	}
	userCallback = callable(callback);
	isUserTriggerOperatorChar = objHasOwnProperty.call(nonNameSet, userTriggerChar);
	i = 0;
	char = userCode[i];
	line = 1;
	columnIndex = 0;
	afterWs = false;
	previousChar = null;
	nest = 0;
	nestedTokens = [];
	results = [];
	exports.forceStop = false;
	state = $ws;
	while (state) state = state();
	return results;
};

Object.defineProperties(exports, {
	$ws: d($ws),
	$common: d($common),
	collectNest: d(collectNest),
	move: d(move),
	index: d.gs(function () { return i; }),
	line: d.gs(function () { return line; }),
	nest: d.gs(function () { return nest; }),
	columnIndex: d.gs(function () { return columnIndex; }),
	next: d(function (step) {
		if (!char) return null;
		move(i + (step || 1));
		return $ws();
	}),
	resume: d(function () { return $common; })
});
