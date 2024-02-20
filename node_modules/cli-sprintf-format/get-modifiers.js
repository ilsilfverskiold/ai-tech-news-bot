"use strict";

const identity                  = require("es5-ext/function/identity")
    , isCallable                = require("es5-ext/object/is-callable")
    , isObject                  = require("es5-ext/object/is-object")
    , isValue                   = require("es5-ext/object/is-value")
    , ensureNaturalNumber       = require("es5-ext/object/ensure-natural-number-value")
    , decimalModifier           = require("sprintf-kit/modifiers/d")
    , floatModifier             = require("sprintf-kit/modifiers/f")
    , integerModifier           = require("sprintf-kit/modifiers/i")
    , jsonModifier              = require("sprintf-kit/modifiers/j")
    , { inspect }               = require("util")
    , clc                       = require("cli-color/bare")
    , defaultInspectDepth       = require("./lib/inspect-depth")
    , defaultColorsSupportLevel = require("./lib/colors-support-level");

const resolveInspectDepth = userValue => {
	if (!isValue(userValue)) return defaultInspectDepth;
	const inspectDepth = Number(userValue);
	if (inspectDepth === Infinity) return inspectDepth;
	return ensureNaturalNumber(inspectDepth);
};

const resolveInspectOptionsVariants = (inspectDepth, colorsSupportLevel) => {
	// Preconfigure inspect options for each case
	const optionsVariants = {};
	optionsVariants.visible = {
		compact: true,
		breakLength: 120,
		depth: inspectDepth,
		colors: colorsSupportLevel
	};
	optionsVariants.all = Object.assign(
		{ showHidden: true, showProxy: true }, optionsVariants.visible
	);
	optionsVariants.json = Object.assign(
		{
			stylize: (str, styleType) => {
				// Hack Node.js inspect to show JSON as JSON
				if (styleType === "name") str = `"${ str }"`;
				else if (styleType === "string") str = `"${ str.slice(1, -1) }"`;
				if (!colorsSupportLevel) return str;
				const style = inspect.styles[styleType];
				if (style === undefined) return str;
				const color = inspect.colors[style];
				return `\u001b[${ color[0] }m${ str }\u001b[${ color[1] }m`;
			}
		},
		optionsVariants.visible,
		{ colors: false }
	);
	optionsVariants.string = Object.assign({}, optionsVariants.visible, { colors: false });
	return optionsVariants;
};

// eslint-disable-next-line max-lines-per-function
module.exports = (options = {}) => {
	if (!isObject(options)) options = {};

	const colorsSupportLevel = isValue(options.colorsSupportLevel)
		? ensureNaturalNumber(options.colorsSupportLevel)
		: defaultColorsSupportLevel;

	const inspectOptionsVariants = resolveInspectOptionsVariants(
		resolveInspectDepth(options.inspectDepth), colorsSupportLevel
	);

	// format utils
	const decorateStringValue = colorsSupportLevel ? clc.green : identity;
	const decorateInvalidValue = colorsSupportLevel ? clc.blackBright : identity;
	const getModifier = (basicModifier, inspectModifier) => value => {
		const stringValue = basicModifier(value);
		if (stringValue[0] === "<") return decorateInvalidValue(stringValue); // pass thru errors
		return inspectModifier(stringValue);
	};

	return {
		d: getModifier(decimalModifier, stringValue =>
			inspect(Number(stringValue), inspectOptionsVariants.visible)
		),
		f: getModifier(floatModifier, stringValue =>
			inspect(Number(stringValue), inspectOptionsVariants.visible)
		),
		i: getModifier(integerModifier, stringValue =>
			inspect(Number(stringValue), inspectOptionsVariants.visible)
		),
		j: getModifier(jsonModifier, stringValue =>
			inspect(JSON.parse(stringValue), inspectOptionsVariants.json)
		),
		o: value => inspect(value, inspectOptionsVariants.all),
		O: value => inspect(value, inspectOptionsVariants.visible),
		s: (value, placeholder) => {
			try {
				if (value && isCallable(value.toString)) value = value.toString();
				else value = String(value);
			} catch (e) {
				return decorateInvalidValue("<invalid>");
			}
			if (placeholder.flags && placeholder.flags.includes("#")) return value;
			return decorateStringValue(inspect(value, inspectOptionsVariants.string).slice(1, -1));
		},
		rest: (args, formatStringData) =>
			`${ formatStringData ? " " : "" }${
				args.map(arg => inspect(arg, inspectOptionsVariants.visible)).join(" ")
			}`
	};
};
