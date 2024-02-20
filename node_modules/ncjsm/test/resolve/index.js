/* eslint max-lines: "off" */

"use strict";

const noop                  = require("es5-ext/function/noop")
    , { resolve }           = require("path")
    , isModuleNotFoundError = require("../../is-module-not-found-error");

const {
	setup: setupFileLinks,
	teardown: teardownFileLinks
} = require("../_lib/setup-playground-file-symlinks");

const {
	setup: setupDirLinks,
	teardown: teardownDirLinks
} = require("../_lib/setup-playground-dir-symlinks");

const playgroundDir = resolve(__dirname, "../__playground");

const unexpected = () => { throw new Error("Unexpected"); };

module.exports = (t, a) =>
	Promise.all([
		t(playgroundDir, "./foo").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/foo.js`),
				realPath: resolve(`${ playgroundDir }/foo.js`)
			});
		}),
		t(playgroundDir, "./foo.js").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/foo.js`),
				realPath: resolve(`${ playgroundDir }/foo.js`)
			});
		}),
		t(playgroundDir, "./foo.json").then(unexpected, error => {
			a(isModuleNotFoundError(error, "./foo.json"), true);
		}),
		t(playgroundDir, "./foo.json", { silent: true }).then(value => a(value, null)),
		t(playgroundDir, "./other").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/other.js`),
				realPath: resolve(`${ playgroundDir }/other.js`)
			});
		}),
		t(playgroundDir, "./other/").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/other/index.js`),
				realPath: resolve(`${ playgroundDir }/other/index.js`)
			});
		}),
		t(playgroundDir, "./samename").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/samename`),
				realPath: resolve(`${ playgroundDir }/samename`)
			});
		}),
		t(playgroundDir, "./samename.js").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/samename.js`),
				realPath: resolve(`${ playgroundDir }/samename.js`)
			});
		}),
		t(playgroundDir, "./samename.json").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/samename.json`),
				realPath: resolve(`${ playgroundDir }/samename.json`)
			});
		}),
		t(playgroundDir, "./samename").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/samename`),
				realPath: resolve(`${ playgroundDir }/samename`)
			});
		}),
		t(playgroundDir, "./dir").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/lorem.js`),
				realPath: resolve(`${ playgroundDir }/dir/lorem.js`)
			});
		}),
		t(playgroundDir, "./dir/lorem").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/lorem.js`),
				realPath: resolve(`${ playgroundDir }/dir/lorem.js`)
			});
		}),
		t(playgroundDir, "./dir/subdir/bar").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/subdir/bar.js`),
				realPath: resolve(`${ playgroundDir }/dir/subdir/bar.js`)
			});
		}),
		t(`${ playgroundDir }/dir`, ".").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/lorem.js`),
				realPath: resolve(`${ playgroundDir }/dir/lorem.js`)
			});
		}),
		t(`${ playgroundDir }/dir`, "./").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/lorem.js`),
				realPath: resolve(`${ playgroundDir }/dir/lorem.js`)
			});
		}),
		t(`${ playgroundDir }/dir`, "./lorem").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/lorem.js`),
				realPath: resolve(`${ playgroundDir }/dir/lorem.js`)
			});
		}),
		t(`${ playgroundDir }/dir`, "../other").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/other.js`),
				realPath: resolve(`${ playgroundDir }/other.js`)
			});
		}),
		t(`${ playgroundDir }/dir`, "../other/").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/other/index.js`),
				realPath: resolve(`${ playgroundDir }/other/index.js`)
			});
		}),
		t(`${ playgroundDir }/dir/subdir`, "../").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/dir/lorem.js`),
				realPath: resolve(`${ playgroundDir }/dir/lorem.js`)
			});
		}),
		t(`${ playgroundDir }/dir/subdir`, "../../foo").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/foo.js`),
				realPath: resolve(`${ playgroundDir }/foo.js`)
			});
		}),
		t(playgroundDir, "outer").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer/raz.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer/raz.js`)
			});
		}),
		t(playgroundDir, "outer/boo").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer/boo.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer/boo.js`)
			});
		}),
		t(playgroundDir, "outer/boo.json").then(unexpected, error => {
			a(isModuleNotFoundError(error, "outer/boo.json"), true);
		}),
		t(playgroundDir, "outer3").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer3/index.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer3/index.js`)
			});
		}),
		t(playgroundDir, "pkg-main-dir").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/pkg-main-dir/lib/index.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/pkg-main-dir/lib/index.js`)
			});
		}),
		t(playgroundDir, "nested/elo").then(unexpected, error => {
			a(isModuleNotFoundError(error, "nested/elo"), true);
		}),
		t(playgroundDir, "broken-main").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/broken-main/index.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/broken-main/index.js`)
			});
		}),
		t(`${ playgroundDir }/node_modules/outer`, "outer3").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer3/index.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer3/index.js`)
			});
		}),
		t(`${ playgroundDir }/node_modules/outer`, "project/foo").then(unexpected, error => {
			a(isModuleNotFoundError(error, "project/foo"), true);
		}),
		t(`${ playgroundDir }/node_modules/outer`, "nested/elo").then(value => {
			a.deep(value, {
				targetPath: resolve(
					`${ playgroundDir }/node_modules/outer/node_modules/nested/elo.js`
				),
				realPath: resolve(
					`${ playgroundDir }/node_modules/outer/node_modules/nested/elo.js`
				)
			});
		}),
		t(`${ playgroundDir }/node_modules/outer/node_modules/nested`, "project/foo").then(
			unexpected,
			error => { a(isModuleNotFoundError(error, "project/foo"), true); }
		),
		t(`${ playgroundDir }/node_modules/outer/node_modules/nested`, "outer").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer/raz.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer/raz.js`)
			});
		}),
		t(`${ playgroundDir }/node_modules/outer/node_modules/nested`, "outer/boo").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer/boo.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer/boo.js`)
			});
		}),
		t(`${ playgroundDir }/node_modules/outer/node_modules/nested`, "outer3").then(value => {
			a.deep(value, {
				targetPath: resolve(`${ playgroundDir }/node_modules/outer3/index.js`),
				realPath: resolve(`${ playgroundDir }/node_modules/outer3/index.js`)
			});
		}),

		setupFileLinks().then(
			() =>
				Promise.all([
					t(playgroundDir, "./valid-file-link").then(value => {
						a.deep(value, {
							targetPath: resolve(`${ playgroundDir }/valid-file-link.js`),
							realPath: resolve(`${ playgroundDir }/file-link-target.js`)
						});
					}),
					t(playgroundDir, "./deep-file-link").then(value => {
						a.deep(value, {
							targetPath: resolve(`${ playgroundDir }/deep-file-link.js`),
							realPath: resolve(`${ playgroundDir }/deep-file-link-target.js`)
						});
					}),
					t(playgroundDir, "./invalid-file-link").then(unexpected, error => {
						a(isModuleNotFoundError(error, "./invalid-file-link"), true);
					}),
					t(playgroundDir, "./invalid-file-link-with-a-fallback").then(value => {
						a.deep(value, {
							targetPath: resolve(
								`${ playgroundDir }/invalid-file-link-with-a-fallback.json`
							),
							realPath: resolve(
								`${ playgroundDir }/invalid-file-link-with-a-fallback.json`
							)
						});
					})
				]).then(teardownFileLinks, error => teardownFileLinks.then(() => { throw error; })),
			error => {
				if (error.code === "EPERM") {
					process.stdout.write(
						"Warning: Could not test file symlinks due to not suffient " +
							"process permissions to create them\n"
					);
					return;
				}
				throw error;
			}
		),

		setupDirLinks().then(() =>
			Promise.all([
				t(playgroundDir, "./valid-dir-link").then(value => {
					a.deep(value, {
						targetPath: resolve(`${ playgroundDir }/valid-dir-link/index.js`),
						realPath: resolve(`${ playgroundDir }/dir-link-target/index.js`)
					});
				}),
				t(playgroundDir, "./deep-dir-link").then(value => {
					a.deep(value, {
						targetPath: resolve(`${ playgroundDir }/deep-dir-link/index.js`),
						realPath: resolve(`${ playgroundDir }/deep-dir-link-target/index.js`)
					});
				}),
				t(playgroundDir, "./invalid-dir-link").then(unexpected, error => {
					a(isModuleNotFoundError(error, "./invalid-dir-link"), true);
				})
			]).then(teardownDirLinks, error => teardownDirLinks.then(() => { throw error; }))
		)
	]).then(noop);
