/* eslint max-statements: off, max-lines: off */

"use strict";

var invoke      = require("es5-ext/function/invoke")
  , noop        = require("es5-ext/function/noop")
  , curry       = require("es5-ext/function/#/curry")
  , contains    = curry.call(require("es5-ext/array/#/contains"))
  , diff        = require("es5-ext/array/#/diff")
  , remove      = require("es5-ext/array/#/remove")
  , assign      = require("es5-ext/object/assign")
  , forEach     = require("es5-ext/object/for-each")
  , isCallable  = require("es5-ext/object/is-callable")
  , isCopy      = require("es5-ext/object/is-copy")
  , isValue     = require("es5-ext/object/is-value")
  , toPosInt    = require("es5-ext/number/to-pos-integer")
  , startsWith  = require("es5-ext/string/#/starts-with")
  , deferred    = require("deferred")
  , fs          = require("fs")
  , pathUtils   = require("path")
  , typeByStats = require("./type-by-stats")
  , watchPath   = require("./watch")
  , isIgnored   = require("./is-ignored");

var isArray = Array.isArray
  , push = Array.prototype.push
  , promisify = deferred.promisify
  , resolve = pathUtils.resolve
  , sep = pathUtils.sep
  , original = fs.readdir
  , lstat = fs.lstat
  , pLstat = promisify(lstat)
  , getIsIgnored = isIgnored.getIsIgnored
  , applyGlobalRules = isIgnored.applyGlobalRules
  , Readdir
  , readdir
  , enoentSurpass
  , eolRe = /(?:\r\n|[\n\r\u2028\u2029])/
  , passErrCodes = ["ENOENT", "DIFFTYPE"];

passErrCodes.contains = contains;
enoentSurpass = function (err) { return passErrCodes.contains(err.code) ? [] : err; };

// eslint-disable-next-line no-empty-function
Readdir = function () {};
Readdir.prototype = {
	init: function () {
		var data, result, promise, stream;
		stream = this.stream;
		data = this.read(this.path, this.depth);
		if (!this.depth) {
			promise = data.files;
			if (this.stream) {
				promise.aside(function (files) {
					if (!files) return;
					promise.emit("change", { data: files, added: files, removed: [] });
				});
			}
			return promise;
		}
		this.readers = {};
		result = [];
		assign(this, deferred());
		promise = this.promise;

		data.files.done(null, this.reject);
		if (this.watch) {
			data.files.on(
				"end",
				function () {
					delete this.readers;
					if (!promise.resolved) {
						this.reject(new Error("Directory was removed"));
						return;
					}
					promise.emit("end", result);
				}.bind(this)
			);
			promise.close = this.close.bind(this);
		}

		(function self(nuData, rootPath, depth) {
			var getPath, files;
			this.readers[rootPath] = { files: nuData.files };
			if (nuData.dirs && nuData.dirs !== nuData.files) {
				this.readers[rootPath].dirs = nuData.dirs;
			}
			if (rootPath) {
				getPath = function (path) { return rootPath + path; };
				files = nuData.files.aside(function (newFiles) {
					if (newFiles.length) {
						newFiles = newFiles.map(getPath);
						push.apply(result, newFiles);
						if (promise.resolved || stream) {
							promise.emit("change", { data: result, removed: [], added: newFiles });
						}
					}
					return newFiles;
				});
			} else {
				files = nuData.files.aside(function (newFiles) {
					if (newFiles && newFiles.length) {
						push.apply(result, newFiles);
						if (promise.resolved || stream) {
							promise.emit("change", { data: result, removed: [], added: newFiles });
						}
					}
					return newFiles;
				});
			}
			if (this.watch) {
				if (rootPath) {
					nuData.files.on(
						"end",
						(nuData.files.onend = function (newFiles) {
							delete this.readers[rootPath];
							if (newFiles.length) {
								newFiles = newFiles.map(getPath);
								remove.apply(result, newFiles);
								if (promise.resolved || stream) {
									promise.emit("change", {
										data: result,
										removed: newFiles,
										added: []
									});
								}
							}
						}.bind(this))
					);
				}
				nuData.files.on("change", function (nextData) {
					var removed, added;
					removed = rootPath ? nextData.removed.map(getPath) : nextData.removed;
					added = rootPath ? nextData.added.map(getPath) : nextData.added;
					remove.apply(result, removed);
					push.apply(result, added);
					if (promise.resolved || stream) {
						promise.emit("change", { data: result, removed: removed, added: added });
					}
				});
			}

			if (nuData.dirs) {
				if (this.watch) {
					nuData.dirs.on(
						"change",
						function (nextData) {
							deferred
								.map(
									nextData.added,
									function (dir) {
										return self.call(
											this,
											this.read(this.path + sep + rootPath + dir, depth - 1),
											rootPath + dir + sep, depth - 1
										);
									},
									this
								)
								.done();
							nextData.removed.forEach(
								function (dir) {
									var path = rootPath + dir + sep, reader = this.readers[path];
									if (reader) {
										reader.files.close();
										if (reader.dirs) reader.dirs.close();
										reader.files.onend(reader.files.value);
										forEach(this.readers, function (newReader, key) {
											if (startsWith.call(key, path)) {
												newReader.files.close();
												if (newReader.dirs) newReader.dirs.close();
												newReader.files.onend(newReader.files.value);
											}
										});
									}
								}.bind(this)
							);
						}.bind(this)
					);
				}
				return deferred(
					files(null, enoentSurpass),
					nuData
						.dirs(null, enoentSurpass)
						.map(function (dir) {
							return self.call(
								this, this.read(this.path + sep + rootPath + dir, depth - 1),
								rootPath + dir + sep, depth - 1
							);
						}, this)
				);
			}
			return files;
		}
			.call(this, data, "", this.depth)
			.done(this.resolve.bind(this, result), this.reject));

		return this.promise;
	},
	close: function () {
		if (this.readers) {
			forEach(this.readers, function (data) {
				data.files.close();
				if (data.dirs) data.dirs.close();
			});
			delete this.readers;
		}
	},
	read: function (path, getDirs) {
		var dirPaths, paths, data;

		paths = this.readdir(path);

		if (this.type || getDirs) {
			data = this.filterByType(paths, getDirs);
			paths = data.files;
			dirPaths = data.dirs;
		} else if (this.pattern || this.globalRules) {
			paths = this.filterByPattern(paths);
		}
		if (this.isIgnored) {
			if (dirPaths && dirPaths !== paths) {
				dirPaths = this.filterIgnored(dirPaths);
				paths = this.filterIgnored(paths);
			} else {
				paths = this.filterIgnored(paths);
				if (dirPaths) dirPaths = paths;
			}
		}

		return { files: paths, dirs: dirPaths };
	},
	filterByType: function (paths, getDirs) {
		var result = {}
		  , test
		  , rootPath = paths.root
		  , files
		  , dirs
		  , resolveCb
		  , defFiles
		  , defDirs
		  , close
		  , resolved
		  , failed;

		if (this.type || this.pattern || this.globalRules) {
			files = [];
			defFiles = deferred();
			result.files = defFiles.promise;
			result.files.root = rootPath;
		} else {
			result.files = paths;
		}
		if (getDirs) {
			if (this.type && isCopy(this.type, { directory: true }) && !this.pattern) {
				dirs = files;
				result.dirs = result.files;
				getDirs = false;
			} else {
				dirs = [];
				defDirs = deferred();
				result.dirs = defDirs.promise;
				result.dirs.root = rootPath;
			}
		}

		resolveCb = function (e) {
			if (defFiles) {
				if (e) defFiles.reject(e);
				else defFiles.resolve(files);
			}
			if (defDirs) {
				if (e) defDirs.reject(e);
				else defDirs.resolve(dirs);
			}
			failed = Boolean(e);
			resolved = true;
		};

		paths.done(
			function (newPaths) {
				if (!newPaths) {
					files = null;
					resolveCb();
					return;
				}
				var waiting = newPaths.length;
				if (!waiting) {
					resolveCb();
					return;
				}
				newPaths.forEach(function (path) {
					var fullPath = rootPath + sep + path;
					if (
						(!getDirs && this.pattern && !this.pattern.test(fullPath)) ||
						(this.globalRules && applyGlobalRules(fullPath, this.globalRules))
					) {
						if (!--waiting) resolveCb();
						return;
					}
					lstat(
						fullPath,
						function (err, stat) {
							var type;
							if (resolved) return;
							if (!err) {
								try {
									type = typeByStats(stat);
								} catch (e) {
									resolveCb(e);
									return;
								}
								if (
									files &&
									(!this.type || this.type[type]) &&
									(!this.pattern || !getDirs || this.pattern.test(fullPath))
								) {
									files.push(path);
								}
								if (getDirs && type === "directory") {
									if (!this.dirFilter || this.dirFilter(fullPath)) {
										dirs.push(path);
									}
								}
							} else if (err.code !== "ENOENT") {
								resolveCb(err);
								return;
							}
							if (!--waiting) resolveCb();
						}.bind(this)
					);
				}, this);
			}.bind(this),
			resolveCb
		);

		if (this.watch) {
			test = function (path, newFiles, newDirs) {
				var fullPath = rootPath + sep + path, promise;
				if (
					(!getDirs && this.pattern && !this.pattern.test(fullPath)) ||
					(this.globalRules && applyGlobalRules(fullPath, this.globalRules))
				) {
					return null;
				}
				promise = pLstat(fullPath).aside(
					function (stat) {
						var type = typeByStats(stat);
						if (
							newFiles &&
							(!this.type || this.type[type]) &&
							(!this.pattern || !getDirs || this.pattern.test(fullPath))
						) {
							newFiles.push(path);
						}
						if (newDirs && type === "directory") newDirs.push(path);
					}.bind(this)
				);
				return promise.catch(function (err) { if (err.code !== "ENOENT") throw err; });
			}.bind(this);

			paths.on("change", function (data) {
				var removed, nFiles, nDirs;
				if (data.added.length) {
					nFiles = files && [];
					nDirs = getDirs && [];
				}
				deferred
					.map(data.added, function (path) { return test(path, nFiles, nDirs); })
					.done(function () {
						if (files) {
							removed = data.removed.filter(contains, files);
							if (removed.length || (nFiles && nFiles.length)) {
								remove.apply(files, removed);
								if (nFiles) push.apply(files, nFiles);
								result.files.emit("change", {
									data: files,
									removed: removed,
									added: nFiles || []
								});
							}
						}
						if (getDirs) {
							removed = data.removed.filter(contains, dirs);
							if (removed.length || (nDirs && nDirs.length)) {
								remove.apply(dirs, removed);
								if (nDirs) push.apply(dirs, nDirs);
								result.dirs.emit("change", {
									data: dirs,
									removed: removed,
									added: nDirs || []
								});
							}
						}
					});
			});

			paths.on("end", function (data, err) {
				if (!resolved) {
					if (defFiles) defFiles.reject(err);
					if (defDirs) defDirs.reject(err);
					return;
				}
				if (!failed) {
					if (files) result.files.emit("end", files, err);
					if (getDirs) result.dirs.emit("end", dirs, err);
				}
			});

			close = function () {
				if (defFiles && !defFiles.resolved) {
					defFiles.reject(new Error("Readdir operation cancelled"));
				}
				if (defDirs && !defDirs.resolved) {
					defDirs.reject(new Error("Readdir operation cancelled"));
				}
				if (paths.close) paths.close();
			};

			if (defFiles) {
				result.files.close = close;
				if (defDirs) result.dirs.close = noop;
			} else {
				result.dirs.close = close;
			}
		}
		return result;
	},
	filterByPattern: function (paths) {
		var promise
		  , result
		  , rootPath = paths.root
		  , pattern = this.pattern
		  , rules = this.globalRules
		  , filter;

		filter = function (path) {
			var fullPath = rootPath + sep + path;
			return (
				(!pattern || pattern.test(fullPath)) &&
				(!rules || !applyGlobalRules(fullPath, rules))
			);
		};

		promise = paths(function (data) { return (result = data.filter(filter)); });
		promise.root = rootPath;
		if (this.watch) {
			paths.on("change", function (data) {
				var removed, added;
				removed = data.removed.filter(contains, result);
				added = data.added.filter(filter);
				if (removed.length || added.length) {
					remove.apply(result, removed);
					push.apply(result, added);
					promise.emit("change", { data: result, removed: removed, added: added });
				}
			});
			paths.on("end", function (data, err) { promise.emit("end", result, err); });
			promise.close = function () { paths.close(); };
		}
		return promise;
	},
	filterIgnored: function (paths) {
		var promise, result, test, rootPath = paths.root, promises, def = deferred();

		promise = def.promise;
		test = function (path, cb) {
			var status = this.isIgnored(rootPath + sep + path);
			if (this.watch) {
				promises[path] = status;
				status.on("change", function (value) {
					if (value) {
						remove.call(result, path);
						promise.emit("change", { data: result, removed: [path], added: [] });
					} else {
						result.push(path);
						promise.emit("change", { data: result, removed: [], added: [path] });
					}
				});
			}
			status.aside(cb);
		}.bind(this);

		if (this.watch) {
			promises = {};

			paths.on("change", function (data) {
				var removed, added = [], waiting = data.added.length, onEnd;
				data.removed.forEach(function (path) {
					promises[path].close();
					delete promises[path];
				});
				removed = data.removed.filter(contains, result);
				onEnd = function () {
					if (removed.length || added.length) {
						remove.apply(result, removed);
						push.apply(result, added);
						promise.emit("change", { data: result, removed: removed, added: added });
					}
				};
				if (!waiting) {
					onEnd();
					return;
				}
				data.added.forEach(function (path) {
					test(path, function (lIsIgnored) {
						if (!lIsIgnored) added.push(path);
						if (!--waiting) onEnd();
					});
				});
			});

			paths.on("end", function (data, err) {
				if (!promises) return;
				forEach(promises, invoke("close"));
				promises = null;
				if (!def.resolved) {
					def.reject(err);
					return;
				}
				promise.emit("end", result, err);
			});

			promise.close = function () {
				if (promises) {
					if (!def.resolved) def.reject(new Error("Operation aborted"));
					forEach(promises, invoke("close"));
					promises = null;
					paths.close();
				}
			};
		}

		paths.done(
			function (newPaths) {
				if (!newPaths) {
					def.resolve(newPaths);
					return;
				}
				var waiting = newPaths.length;
				result = [];
				if (!waiting) {
					def.resolve(result);
					return;
				}
				newPaths.forEach(function (path) {
					test(path, function (lIsIgnored) {
						if (!lIsIgnored) result.push(path);
						if (!--waiting) def.resolve(result);
					});
				});
			},
			function (e) { def.reject(e); }
		);
		promise.root = rootPath;
		return promise;
	},
	readdir: function (path) {
		var def, promise, watcher, files;
		def = deferred();
		promise = def.promise;
		promise.root = path;
		if (this.watch) {
			try { watcher = watchPath(path); }
			catch (e) { return def.reject(e); }
			watcher.on("end", function (err) {
				if (!def.resolved) def.reject(err);
				else if (files) promise.emit("end", files, err);
			});
			watcher.on("change", function () {
				original(path, function (err, data) {
					var removed, added;
					if (err) {
						promise.emit("end", files, err);
						return;
					}
					removed = diff.call(files, data);
					added = diff.call(data, files);
					if (removed.length || added.length) {
						remove.apply(files, removed);
						push.apply(files, added);
						promise.emit("change", { data: files, removed: removed, added: added });
					}
				});
			});
			promise.close = function () {
				watcher.close();
				if (!def.resolved) def.reject(new Error("Readdir action cancelled"));
			};
		}
		original(
			path,
			function (err, data) {
				if (err) {
					if (this.loose && this.path === path && err.code === "ENOENT") {
						def.resolve(null);
					} else {
						def.reject(err);
					}
					return;
				}
				def.resolve((files = data));
			}.bind(this)
		);
		return promise;
	}
};

readdir = function (path, options) {
	var lReaddir, globalRules;

	lReaddir = new Readdir();
	lReaddir.path = path;
	lReaddir.depth = isNaN(options.depth) ? 0 : toPosInt(options.depth);
	lReaddir.type = isValue(options.type) ? Object(options.type) : null;
	lReaddir.loose = Boolean(options.loose);
	lReaddir.pattern = isValue(options.pattern) ? new RegExp(options.pattern) : null;
	if (isValue(options.dirFilter)) {
		if (typeof options.dirFilter === "function") lReaddir.dirFilter = options.dirFilter;
		else lReaddir.dirFilter = RegExp.prototype.test.bind(new RegExp(options.dirFilter));
	}
	lReaddir.watch = options.watch;
	lReaddir.stream = Boolean(options.stream);

	if (options.globalRules) {
		globalRules = isArray(options.globalRules)
			? options.globalRules
			: String(options.globalRules).split(eolRe);
	}
	if (options.ignoreRules) {
		assign(
			lReaddir,
			getIsIgnored(
				isArray(options.ignoreRules) ? options.ignoreRules : [options.ignoreRules],
				globalRules, options.watch
			)
		);
	} else {
		lReaddir.globalRules = globalRules;
	}

	return lReaddir.init();
};
readdir.returnsPromise = true;

module.exports = exports = function (path) {
	var options, cb;
	path = resolve(String(path));
	options = Object(arguments[1]);
	cb = arguments[2];
	if (!isValue(cb) && isCallable(options)) {
		cb = options;
		options = {};
	}

	return readdir(path, options).cb(cb);
};
exports.returnsPromise = true;
exports.readdir = readdir;
