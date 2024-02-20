"use strict";

const { resolve } = require("path")
    , symlink     = require("fs2/symlink")
    , unlink      = require("fs2/unlink");

const playgroundDir = resolve(__dirname, "../__playground"), symlinkOptions = { type: "file" };

const links = [
	{
		destination: resolve(playgroundDir, "another-deep-file-link.js"),
		source: "deep-file-link-target.js"
	},
	{
		destination: resolve(playgroundDir, "deep-file-link.js"),
		source: "another-deep-file-link.js"
	},
	{
		destination: resolve(playgroundDir, "invalid-file-link-with-a-fallback.js"),
		source: "non-existing-file.js"
	},
	{ destination: resolve(playgroundDir, "invalid-file-link.js"), source: "non-existing-file.js" },
	{ destination: resolve(playgroundDir, "valid-file-link.js"), source: "file-link-target.js" }
];

module.exports = {
	setup: () =>
		Promise.all(
			links.map(({ source, destination }) => symlink(source, destination, symlinkOptions))
		),
	teardown: () => Promise.all(links.map(({ destination }) => unlink(destination)))
};
