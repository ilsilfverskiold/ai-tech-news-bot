"use strict";

const isThenable    = require("es5-ext/object/is-thenable")
    , { assert }    = require("chai")
    , { Readable }  = require("stream")
    , streamPromise = require("../");

describe("(main)", () => {
	it("Should convert stream to promise", () => {
		const stream = Object.assign(new Readable(), { _read() { this.push(null); } });
		const result = streamPromise(stream);
		assert.equal(isThenable(result), true);
		assert.equal(result, stream);
		return result;
	});
	it("Should expose emitted data", () => {
		let counter = 2;
		const stream = Object.assign(new Readable({ encoding: "utf8" }), {
			_read() { this.push(counter-- ? String(counter) : null); }
		});
		return streamPromise(stream).then(() => { assert.equal(stream.emittedData, "10"); });
	});
});
