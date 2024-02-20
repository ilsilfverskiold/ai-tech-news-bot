"use strict";

const crypto               = require("crypto")
    , path                 = require("path")
    , fs                   = require("fs").promises
    , resolveProcessTmpDir = require("./");

module.exports = async () => {
	const processTmpDir = await resolveProcessTmpDir();
	const provisionedTmpDir = path.join(processTmpDir, crypto.randomBytes(3).toString("hex"));
	try {
		await fs.mkdir(provisionedTmpDir);
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
		return module.exports();
	}
	return provisionedTmpDir;
};
