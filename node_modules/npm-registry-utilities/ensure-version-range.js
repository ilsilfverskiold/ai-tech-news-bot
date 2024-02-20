"use strict";

const ensureString = require("type/string/ensure")
    , semver       = require("semver");

module.exports = versionRange => {
	versionRange = ensureString(versionRange, { errorCode: "INVALID_VERSION_RANGE" });
	if (!semver.validRange(versionRange)) {
		throw Object.assign(new Error(`Invalid version range "${ versionRange }"`), {
			code: "INVALID_VERSION_RANGE"
		});
	}
	return versionRange;
};
