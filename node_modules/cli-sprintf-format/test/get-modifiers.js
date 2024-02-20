"use strict";

const d               = require("d")
    , test            = require("tape")
    , requireUncached = require("cjs-module/require-uncached")
    , overrideEnv     = require("process-utils/override-env");

const resolveUncached = callback => {
	const { restoreEnv } = overrideEnv();
	try {
		return requireUncached(
			[
				require.resolve("supports-color"), require.resolve("../lib/colors-support-level"),
				require.resolve("../lib/inspect-depth"), require.resolve("../get-modifiers")
			],
			() => {
				callback();
				return require("../get-modifiers");
			}
		);
	} finally {
		restoreEnv();
	}
};

test("getModifiers", t => {
	t.test(t => {
		const modifiers = resolveUncached(() => (require("supports-color").stderr = false))(null);
		const testObj = Object.defineProperties({ foo: "bar" }, { hidden: d("elo") });
		t.equal(modifiers.d(20.2), "20.2", "d modifier should expose decimal");
		t.equal(modifiers.f(21.21), "21.21", "f modifier should expose float");
		t.equal(modifiers.i(22.22), "22", "i modifier should expose integer");
		t.equal(modifiers.j(testObj), "{ \"foo\": \"bar\" }", "j modifier should expose json");
		t.equal(modifiers.j("str"), "\"str\"", "j modifier should handle primitives");
		const circularObj = {};
		circularObj.circular = circularObj;
		t.equal(modifiers.j(circularObj).startsWith("<"), true, "Handles circular JSON");
		t.equal(
			modifiers.o(testObj), "{ foo: 'bar', [hidden]: 'elo' }",
			"o modifier should expose all object properties"
		);
		t.equal(
			// eslint-disable-next-line new-cap
			modifiers.O(testObj),
			"{ foo: 'bar' }",
			"O modifier should expose only enumerable object properties"
		);
		t.equal(
			modifiers.s("maro\nmar", {}), "maro\\nmar",
			"s modifier should put inline multiline string"
		);
		t.equal(modifiers.s(undefined, {}), "undefined", "s modifier exposes no value");
		t.equal(
			modifiers.s("maro\nmar", { flags: "#" }), "maro\nmar",
			"s modifier with '#' should put inline multiline string"
		);
		t.equal(
			modifiers.s(Object.create(null), {}), "<invalid>",
			"s modifier handles not stringifiable value"
		);
		t.equal(
			modifiers.rest(["rest", "arg"], {}), " 'rest' 'arg'",
			"rest modifier should resolve rest args"
		);
		t.equal(
			modifiers.rest(["rest", "arg"]), "'rest' 'arg'",
			"rest modifier should not add leading whitespace if no format data is passed"
		);

		t.end();
	});
	t.test(t => {
		const modifiers = resolveUncached(
			() => (require("supports-color").stdout = { level: 1 })
		)();

		t.equal(
			modifiers.j({ foo: "bar" }), "{ \"foo\": \x1b[32m\"bar\"\x1b[39m }",
			"Supports formatting with colors"
		);
		t.equal(modifiers.j(1), "\x1b[33m1\x1b[39m", "Supports formatting primitives with colors");
		t.end();
	});

	t.test(t => {
		const modifiers = resolveUncached(() => {
			process.env.FORMAT_INSPECT_DEPTH = "1";
			require("supports-color").stderr = false;
		})();
		t.equal(
			modifiers.o({ foo: 12, bar: { elo: { frelo: 22 } } }),
			"{ foo: 12, bar: { elo: [Object] } }",
			"Supports customization of inspect depth via FORMAT_INSPECT_DEPTH var"
		);
		t.end();
	});

	t.test(t => {
		const modifiers = resolveUncached(() => {
			require("supports-color").stdout = { level: 1 };
		})({ inspectDepth: 1, colorsSupportLevel: 0 });
		t.equal(
			modifiers.o({ foo: 12, bar: { elo: { frelo: 22 } } }),
			"{ foo: 12, bar: { elo: [Object] } }",
			"Supports customizations of inspect depth and colors via options"
		);
		t.end();
	});

	t.test(t => {
		const modifiers = resolveUncached(() => {
			require("supports-color").stdout = { level: 1 };
		})({ inspectDepth: Infinity, colorsSupportLevel: 0 });
		t.equal(
			modifiers.o({ foo: { elo: { foo: { bar: { elo: { marko: { miszko: true } } } } } } }),
			"{ foo: { elo: { foo: { bar: { elo: { marko: { miszko: true } } } } } } }",
			"Supports Infiinity as inspect depth setting"
		);
		t.end();
	});
	t.end();
});
