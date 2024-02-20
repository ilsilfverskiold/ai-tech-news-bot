"use strict";

const isObject               = require("type/object/is")
    , isValue                = require("type/value/is")
    , semver                 = require("semver")
    , ensurePackageName      = require("./ensure-package-name")
    , ensureVersionRange     = require("./ensure-version-range")
    , resolvePackageMetadata = require("./resolve-package-metadata");

module.exports = async (name, versionRange = null, options = {}) => {
	name = ensurePackageName(name);
	if (isValue(versionRange)) versionRange = ensureVersionRange(versionRange);
	if (!isObject(options)) options = {};
	const metadata = await resolvePackageMetadata(name, options);
	if (!versionRange) versionRange = metadata["dist-tags"].latest;
	if (semver.valid(versionRange)) return metadata.versions[versionRange] || null;
	const allVersions = [], stableVersions = [];
	for (const [version, meta] of Object.entries(metadata.versions)) {
		const versionData = semver.parse(version);
		if (versionData.prerelease.length) continue;
		allVersions.push(version);
		if (!meta.deprecated) stableVersions.push(version);
	}
	const resultVersion =
		semver.maxSatisfying(stableVersions, versionRange) ||
		semver.maxSatisfying(allVersions, versionRange);
	if (!resultVersion) return null;
	return metadata.versions[resultVersion];
};
