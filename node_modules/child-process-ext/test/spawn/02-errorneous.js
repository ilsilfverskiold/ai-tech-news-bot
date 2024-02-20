"use strict";

const noop        = require("es5-ext/function/noop")
    , { resolve } = require("path")
    , { assert }  = require("chai")
    , spawn       = require("../../spawn");

const playgroundPath = resolve(__dirname, "_playground");

const throwUnexpected = () => { throw new Error("Unexpected"); };

describe("spawn - Errorneous execution", () => {
	let program;
	before(() =>
		(program = spawn("./test-bin-error", ["umpa", "--elo", "marko"], {
			cwd: playgroundPath
		})).catch(noop)
	);

	it("Errorneous execution should resolve with rejection", () =>
		program.then(throwUnexpected, noop)
	);

	it("Errorneous execution result should expose exit code", () =>
		program.then(throwUnexpected, ({ code }) => assert.equal(code, 3))
	);

	it("Errorneous execution result should expose stdout", () =>
		program.then(throwUnexpected, ({ stdoutBuffer }) =>
			assert.equal(String(stdoutBuffer), "stdout")
		)
	);

	it("Errorneous execution result should expose stderr", () =>
		program.then(throwUnexpected, ({ stderrBuffer }) =>
			assert.equal(String(stderrBuffer), "stderr")
		)
	);
});
