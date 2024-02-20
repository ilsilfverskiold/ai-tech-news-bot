"use strict";

module.exports = function (stat) {
	if (stat.isFile()) {
		return "file";
	}
	if (stat.isDirectory()) {
		return "directory";
	}
	if (stat.isSymbolicLink && stat.isSymbolicLink()) {
		return "symbolicLink";
	}
	if (stat.isSocket()) {
		return "socket";
	}
	if (stat.isBlockDevice()) {
		return "blockDevice";
	}
	if (stat.isCharacterDevice()) {
		return "characterDevice";
	}
	if (stat.isFIFO()) {
		return "FIFO";
	}
	throw new Error("Cannot detect type");
};
