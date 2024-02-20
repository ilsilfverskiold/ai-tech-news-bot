"use strict";

const { resolve } = require("path")
    , { assert }  = require("chai")
    , spawn       = require("../../spawn");

const playgroundPath = resolve(__dirname, "_playground");

describe("spawn - Successful execution", () => {
	let program;
	before(
		() =>
			(program = spawn("./test-bin-success", ["foo", "--elo", "marko"], {
				cwd: playgroundPath
			}))
	);

	it("Should fulfill successfully", () => program.then());

	it("Arguments should be passed into process", () =>
		program.then(({ stdoutBuffer }) =>
			assert.equal(
				String(stdoutBuffer), `${ JSON.stringify(["foo", "--elo", "marko"]) }\nstdout`
			)
		)
	);

	it("Promise result should expose exit code", () =>
		program.then(({ code }) => assert.equal(code, 0))
	);

	it("Promise result should expose stdout buffer", () =>
		program.then(({ stdoutBuffer }) =>
			assert.equal(
				String(stdoutBuffer), `${ JSON.stringify(["foo", "--elo", "marko"]) }\nstdout`
			)
		)
	);

	it("Promise result should expose stderr buffer", () =>
		program.then(({ stderrBuffer }) => assert.equal(String(stderrBuffer), "\nstderr"))
	);

	it("Promise result should expose merged std buffer", () =>
		program.then(({ stdBuffer }) =>
			assert.equal(
				String(stdBuffer), `${ JSON.stringify(["foo", "--elo", "marko"]) }\nstderr\nstdout`
			)
		)
	);
});
