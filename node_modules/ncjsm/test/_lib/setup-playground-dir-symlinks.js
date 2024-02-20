"use strict";

const { resolve } = require("path")
    , symlink     = require("fs2/symlink")
    , unlink      = require("fs2/unlink");

const playgroundDir = resolve(__dirname, "../__playground"), symlinkOptions = { type: "junction" };

const links = [
	{
		destination: resolve(playgroundDir, "another-deep-dir-link"),
		source: "deep-dir-link-target"
	},
	{ destination: resolve(playgroundDir, "deep-dir-link"), source: "another-deep-dir-link" },
	{ destination: resolve(playgroundDir, "invalid-dir-link"), source: "non-existing-dir" },
	{ destination: resolve(playgroundDir, "valid-dir-link"), source: "dir-link-target" }
];

module.exports = {
	setup: () =>
		Promise.all(
			links.map(({ source, destination }) => symlink(source, destination, symlinkOptions))
		),
	teardown: () => Promise.all(links.map(({ destination }) => unlink(destination)))
};
