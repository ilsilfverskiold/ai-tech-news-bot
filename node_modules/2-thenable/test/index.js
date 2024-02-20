"use strict";

const noop       = require("es5-ext/function/noop")
    , { assert } = require("chai")
    , toThenable = require("../");

describe("(main)", () => {
	it("Should convert to thenable", () => {
		const target = {};
		toThenable(target, Promise.resolve("foo"));
		return target.then(result => assert.equal(result, "foo"));
	});
	it("Should implement `catch` method", () => {
		const target = {}, error = new Error();
		toThenable(target, Promise.reject(error));
		return target.catch(result => assert.equal(result, error));
	});
	it("Should implement `finally` method", () => {
		const target = {};
		let invoked = false;
		toThenable(target, Promise.resolve("foo"));
		return target.finally(() => (invoked = true)).then(result => {
			assert.equal(result, "foo");
			assert.equal(invoked, true);
		});
	});
	it("Should return target object", () => {
		const target = {};
		assert.equal(toThenable(target, Promise.resolve("foo")), target);
	});
	it("Should throw if target object is already a thenable", () => {
		const target = { then: noop };
		assert.throws(() => { toThenable(target, Promise.resolve("foo")); }, TypeError);
	});
	it("Should throw if target object has 'then' property", () => {
		const target = { then: undefined };
		assert.throws(() => { toThenable(target, Promise.resolve("foo")); }, TypeError);
	});
	it("Should throw if target object already has `catch` property", () => {
		const target = { catch: undefined };
		assert.throws(() => { toThenable(target, Promise.resolve("foo")); }, TypeError);
	});
	it("Should throw if target object already has `finally` property", () => {
		const target = { finally: undefined };
		assert.throws(() => { toThenable(target, Promise.resolve("foo")); }, TypeError);
	});
});
