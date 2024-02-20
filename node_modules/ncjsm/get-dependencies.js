"use strict";

const uniq                 = require("es5-ext/array/#/uniq")
    , ensureString         = require("type/string/ensure")
    , isObject             = require("type/object/is")
    , deferred             = require("deferred")
    , { dirname, resolve } = require("path")
    , readFile             = require("fs2/read-file")
    , findRequires         = require("find-requires")
    , builtinModules       = new Set(require("builtin-modules"))
    , cjsResolve           = require("./resolve");

const nonLocalChar = new Set([".", "/"]);

const getDirectDependencies = function (modulePath, options) {
	return readFile(modulePath)(content => {
		const dir = dirname(modulePath);
		return deferred.map(
			uniq.call(
				findRequires(content, {
					setupCode: `var __filename = ${ JSON.stringify(modulePath) }, __dirname = ${
						JSON.stringify(dir)
					};`
				})
			),
			depPath => {
				if (!nonLocalChar.has(depPath[0])) {
					if (options.ignoreExternal) return null;
					if (builtinModules.has(depPath.split("/")[0])) return null;
				}
				return cjsResolve(dir, depPath, { silent: true })(pathData => {
					if (pathData) return pathData.targetPath;
					if (options.ignoreMissing) return null;
					throw new Error(
						`Could not resolve ${ JSON.stringify(depPath) } module, required in ${
							JSON.stringify(modulePath)
						}`
					);
				});
			}
		)(paths => uniq.call(paths).filter(Boolean));
	});
};

module.exports = function (programPath, options = {}) {
	if (!isObject(options)) options = {};
	programPath = resolve(ensureString(programPath));
	const paths = Object.create(null);
	return (function self(modulePath) {
		if (paths[modulePath]) return null;
		return (paths[modulePath] = getDirectDependencies(modulePath, options).map(self));
	})(programPath)(() => Object.keys(paths));
};
