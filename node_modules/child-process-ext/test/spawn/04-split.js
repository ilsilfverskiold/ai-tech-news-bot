"use strict";

const { resolve } = require("path")
    , { assert }  = require("chai")
    , spawn       = require("../../spawn");

const playgroundPath = resolve(__dirname, "_playground")
    , stdoutLines = ["firstBLAline", "secondBLAline", "", "fourthBLAline"]
    , stderrLines = ["one", "two"];

describe("spawn - Split stdout", () => {
	let program;
	const reportedStdoutLines = [], reportedStderrLines = [];
	before(() => {
		program = spawn("./test-bin-split", null, { cwd: playgroundPath, split: true });
		program.stdout.on("data", data => reportedStdoutLines.push(data));
		program.stderr.on("data", data => reportedStderrLines.push(data));
		return program;
	});

	it("Should split stdout", () => assert.deepEqual(reportedStdoutLines, stdoutLines));

	it("Should split stderr", () => assert.deepEqual(reportedStderrLines, stderrLines));

	it("stdout should resolve with array of lines", () =>
		program.stdout.then(result => assert.deepEqual(result, stdoutLines))
	);

	it("stderr should resolve with array of lines", () =>
		program.stderr.then(result => assert.deepEqual(result, stderrLines))
	);
});
