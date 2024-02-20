"use strict";

var uniGlobal = require("uni-global")("medikoo/essentials/202112");

if (uniGlobal.isSetup) {
	// Doubled load of essentials, abort
	return;
}

uniGlobal.isSetup = true;

// 1. Expose every stack frame in error stack trace
Error.stackTraceLimit = Infinity;

// 2. Expose unhandled promise rejections as uncaught exceptions
if (typeof process === "object" && process && typeof process.on === "function") {
	// Node.js
	process.on("unhandledRejection", function (reason) {
		// If user attached its own unhandledRejection handler, abort
		if (process.listenerCount("unhandledRejection") > 1) return;
		throw reason;
	});
}
if (typeof addEventListener === "function") {
	// HTML
	addEventListener("unhandledrejection", function (event) {
		event.preventDefault();
		throw event.reason;
	});
}
