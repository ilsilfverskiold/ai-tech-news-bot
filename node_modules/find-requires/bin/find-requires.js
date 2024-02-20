#!/usr/bin/env node

// Find places where a module is required across one or more files.

"use strict";

const fs           = require("fs")
    , findRequires = require("..");

const filenames = process.argv.slice(2);

if (!filenames.length) {
	process.stdout.write("Usage: $0 [file1..fileN]\n");
	process.exit();
}

const processFile = function (filename, src) {
	let results;
	try {
		results = findRequires(src, { raw: true });
	} catch (e) {
		process.stderr.write(`Error in ${ filename }: ${ e.message }\n`);
		return;
	}

	results.forEach(item => {
		process.stdout.write(`${ filename }:${ item.line }:${ item.value || item.raw }\n`);
	});
};

filenames.forEach(filename => {
	fs.readFile(filename, "utf-8", (err, src) => {
		if (err) {
			process.stderr.write(`Failed reading ${ filename }\n`);
			return;
		}

		processFile(filename, src);
	});
});
