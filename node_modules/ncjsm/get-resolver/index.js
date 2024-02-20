// Returns CJS module (sync or async) path resolver

"use strict";

var dirname = function (path) { return path.slice(0, path.lastIndexOf("/")) || "/"; };
var join = function (path1, path2) { return path1 === "/" ? path1 + path2 : path1 + "/" + path2; };

module.exports = function (extensions, confirmFile, resolvePackageMain) {
	var resolveFile = function (path, extIndex) {
		var targetPath = path + (extIndex == null ? "" : extensions[extIndex]);
		return confirmFile(targetPath).then(function (result) {
			if (result) return result;
			if (extIndex == null) extIndex = 0;
			else ++extIndex;
			if (!extensions[extIndex]) return null;
			return resolveFile(path, extIndex);
		});
	};
	var resolveDirectory = function (path) {
		return resolvePackageMain(path).then(function (result) {
			if (result) {
				var mainPath = join(path, result);
				return resolveFile(mainPath).then(function (mainResult) {
					if (mainResult) return mainResult;
					return resolveFile(join(mainPath, "index"), 0).then(function (mainDirResult) {
						if (mainDirResult) return mainDirResult;
						return resolveFile(join(path, "index"), 0);
					});
				});
			}
			return resolveFile(join(path, "index"), 0);
		});
	};
	var resolveLocal = function (path) {
		var pathChar = path.charAt(path.length - 1);
		if (pathChar === "/") return resolveDirectory(path);
		if (pathChar === ".") {
			pathChar = path.charAt(path.length - 2);
			if (pathChar === "/") return resolveDirectory(path);
			if (pathChar === ".") {
				if (path.charAt(path.length - 3) === "/") return resolveDirectory(path);
			}
		}
		return resolveFile(path).then(function (result) {
			return result || resolveDirectory(path);
		});
	};
	var resolveExternal = function (dir, path) {
		return resolveLocal(join(dir, "node_modules") + "/" + path).then(function (result) {
			if (result) return result;
			if (dir === "/") return null;
			return resolveExternal(dirname(dir), path);
		});
	};
	return function (dir, path) {
		var pathChar;
		if (path.charAt(0) === "/") return resolveLocal(path);
		if (path.charAt(0) === ".") {
			pathChar = path.charAt(1);
			if (!pathChar || pathChar === "/") return resolveLocal(join(dir, path));
			if (pathChar === ".") {
				pathChar = path.charAt(2);
				if (!pathChar || pathChar === "/") return resolveLocal(join(dir, path));
			}
		}
		return resolveExternal(dir, path);
	};
};
