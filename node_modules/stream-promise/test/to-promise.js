"use strict";

const isThenable             = require("es5-ext/object/is-thenable")
    , { assert }             = require("chai")
    , { Readable, Writable } = require("stream")
    , toPromise              = require("../to-promise");

describe("toPromise", () => {
	describe("Readable streams", () => {
		it("Should return a promise", () => {
			const stream = Object.assign(new Readable(), { _read() { this.push(null); } });
			const result = toPromise(stream);
			assert.equal(isThenable(result), true);
			return result;
		});
		it("When no data read, should resolve with null", () => {
			const stream = Object.assign(new Readable(), { _read() { this.push(null); } });
			return toPromise(stream).then(result => assert.equal(result, null));
		});
		it("Binary streams should resolve with buffers containing all output", () => {
			let counter = 2;
			const stream = Object.assign(new Readable(), {
				_read() {
					if (counter--) this.push(String(counter));
					else this.push(null);
				}
			});
			return toPromise(stream).then(result => {
				assert.equal(Buffer.isBuffer(result), true);
				assert.equal(String(result), "10");
			});
		});
		it("Streams with specified utf8 encoding should resolve with strings all output", () => {
			let counter = 2;
			const stream = Object.assign(new Readable({ encoding: "utf8" }), {
				_read() {
					if (counter--) this.push(String(counter));
					else this.push(null);
				}
			});
			return toPromise(stream).then(result => { assert.equal(result, "10"); });
		});
		it("Object streams should resolve with an array", () => {
			let counter = 2;
			const stream = Object.assign(new Readable({ objectMode: true }), {
				_read() {
					if (counter--) this.push(counter);
					else this.push(null);
				}
			});
			return toPromise(stream).then(result => { assert.deepEqual(result, [1, 0]); });
		});
		it("Should expose already emitted data", () => {
			let counter = 2;
			const stream = Object.assign(new Readable({ encoding: "utf8" }), {
				_read() {
					if (counter--) this.push(String(counter));
					else this.push(null);
				}
			});
			const promise = toPromise(stream);
			return promise.then(() => { assert.equal(promise.emittedData, "10"); });
		});
	});
	describe("Writable streams", () => {
		it("Should return a promise", () => {
			const stream = Object.assign(new Writable(), {
				_write(chunk, encoding, callback) { callback(); }
			});
			const result = toPromise(stream);
			stream.end();
			assert.equal(isThenable(result), true);
			return result;
		});
		it("Should resolve with null", () => {
			const stream = Object.assign(new Writable(), {
				_write(chunk, encoding, callback) { callback(); }
			});
			const result = toPromise(stream);
			stream.write("foo");
			stream.write("bar");
			stream.end();
			return result.then(result => assert.equal(result, undefined));
		});
	});
});
