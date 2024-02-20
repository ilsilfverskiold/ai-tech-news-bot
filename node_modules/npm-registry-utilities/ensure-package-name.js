"use strict";

const ensureString        = require("type/string/ensure")
    , validatePackageName = require("validate-npm-package-name");

module.exports = packageName => {
	packageName = ensureString(packageName, { errorCode: "INVALID_PACKAGE_NAME" });
	const validationResult = validatePackageName(packageName);
	if (!validationResult.validForOldPackages) {
		throw Object.assign(
			new Error(
				`Invalid package name "${ packageName }":\n\t${
					validationResult.errors.join("\n\t")
				}`
			),
			{ code: "INVALID_PACKAGE_NAME" }
		);
	}
	return packageName;
};
