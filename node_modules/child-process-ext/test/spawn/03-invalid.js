"use strict";

const noop        = require("es5-ext/function/noop")
    , { resolve } = require("path")
    , { assert }  = require("chai")
    , spawn       = require("../../spawn");

const playgroundPath = resolve(__dirname, "_playground");

const throwUnexpected = () => { throw new Error("Unexpected"); };

describe("spawn - Invalid execution", () => {
	let program;
	before(() =>
		(program = spawn("./test-bin-non-existing", ["umpa", "--elo", "marko"], {
			cwd: playgroundPath
		})).catch(noop)
	);
	it("Invalid program execution should resolve with rejection", () =>
		program.then(throwUnexpected, noop)
	);

	it("Invalid program rejection should expose expected eror code", () =>
		program.then(throwUnexpected, ({ code }) => assert.equal(code, "ENOENT"))
	);
});
