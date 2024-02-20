#!/usr/bin/env node

"use strict";

require("essentials");

const d               = require("d")
    , test            = require("tape")
    , requireUncached = require("cjs-module/require-uncached")
    , overrideEnv     = require("process-utils/override-env");

const resolveUncached = callback => {
	const { restoreEnv } = overrideEnv();
	try {
		return requireUncached(
			[
				require.resolve(".."), require.resolve("supports-color"),
				require.resolve("../lib/colors-support-level"),
				require.resolve("../lib/inspect-depth"), require.resolve("../get-modifiers")
			],
			() => {
				callback();
				return require("..");
			}
		);
	} finally {
		restoreEnv();
	}
};

test("(main)", t => {
	const format = resolveUncached(() => (require("supports-color").stderr = false));
	t.equal(format("foo bar"), "foo bar", "Should format message with no placeholders");
	const testObj = Object.defineProperties({ foo: "bar" }, { hidden: d("elo") });
	t.equal(
		format(
			"foo bar %d %f %i %j %o %O then%s", 20.2, 21.21, 22.22, testObj, testObj, testObj,
			"maro", "rest", "arg"
		),
		"foo bar 20.2 21.21 22 { \"foo\": \"bar\" } " +
			"{ foo: 'bar', [hidden]: 'elo' } { foo: 'bar' } thenmaro 'rest' 'arg'",
		"Supports sprintf formatting with rest params"
	);
	t.end();
});

require("./get-modifiers.js");
