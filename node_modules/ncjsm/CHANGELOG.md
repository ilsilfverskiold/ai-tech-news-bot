# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.3.2](https://github.com/medikoo/ncjsm/compare/v4.3.1...v4.3.2) (2023-01-13)

### Bug Fixes

- **`requireUncached`:** Fix modules cache recovery on global reset ([c90dae4](https://github.com/medikoo/ncjsm/commit/c90dae4c31fb4f3e3e490ca8af87d279500730ed))

### [4.3.1](https://github.com/medikoo/ncjsm/compare/v4.3.0...v4.3.1) (2022-07-09)

### Bug Fixes

- Fix `ignoreMissing` support in deep dependencies resolution ([#6](https://github.com/serverless/serverless/issues/6)) ([669491c](https://github.com/medikoo/ncjsm/commit/669491c8ba2942ef7f1d5caa98a11082d9767dd4)) ([Diego Henrique Domingues](https://github.com/ddomingues))

### Maintenance Improvements

- Bump dependencies ([48cac7c](https://github.com/medikoo/ncjsm/commit/48cac7ccc312dd58bee7559b9214fc13f78910b5))
- Fix `.editorconfig` ([3300948](https://github.com/medikoo/ncjsm/commit/3300948b2f5d724df9d5efb14ebb0101f1a37691))
- Upgrade `lint-staged` to v13 ([a6e6a8f](https://github.com/medikoo/ncjsm/commit/a6e6a8f2573a741a081dde9e32555aec140be73c))

## [4.3.0](https://github.com/medikoo/ncjsm/compare/v4.2.0...v4.3.0) (2022-01-24)

### Features

- Support async callback in `requireUncached` ([91fdb82](https://github.com/medikoo/ncjsm/commit/91fdb82b171651ff5740a3d6e6a12f632415e0e9))

## [4.2.0](https://github.com/medikoo/ncjsm/compare/v4.1.0...v4.2.0) (2021-04-30)

### Features

- **Require Uncached:** Support clearing all require cache for callback ([75c2229](https://github.com/medikoo/ncjsm/commit/75c2229854885e257fdd061699600208d438b561))

## [4.1.0](https://github.com/medikoo/ncjsm/compare/v4.0.1...v4.1.0) (2020-07-22)

### Features

- `ignoreExternal` option for `getDependencies` ([158075b](https://github.com/medikoo/ncjsm/commit/158075bea3f66ac77bae5341fd474930172047a2))

### [4.0.1](https://github.com/medikoo/ncjsm/compare/v4.0.0...v4.0.1) (2019-10-25)

### Bug Fixes

- Fix main module resolution in case pkg.main leads to broken path ([331dd1c](https://github.com/medikoo/ncjsm/commit/331dd1c))

### Tests

- Add missing test ([2469fe9](https://github.com/medikoo/ncjsm/commit/2469fe9))

## [4.0.0](https://github.com/medikoo/ncjsm/compare/v3.0.0...v4.0.0) (2019-10-08)

### Bug Fixes

- Fix requireUncached moduleIds validation ([eb2e026](https://github.com/medikoo/ncjsm/commit/eb2e026))

### Features

- By default crash resolve with MODULE_NOT_FOUND if module not found ([0e446c4](https://github.com/medikoo/ncjsm/commit/0e446c4))

### BREAKING CHANGES

- `resolve` and `resolve/sync` now by default crash with MODULE_NOT_FOUND error, if module is not found. Old behavior was that `null` was returned.
  To maintain old behavior { silent: true } option needs to be passed

## [3.0.0](https://github.com/medikoo/ncjsm/compare/v2.3.0...v3.0.0) (2019-09-02)

### Features

- Change resolve return value format ([747493e](https://github.com/medikoo/ncjsm/commit/747493e))
- Expose realPath on resolve return object ([5ad6b23](https://github.com/medikoo/ncjsm/commit/5ad6b23))

### Tests

- Configure directory links tests ([988c92a](https://github.com/medikoo/ncjsm/commit/988c92a))
- Cover symlink cases in resolve tests ([c97d4a0](https://github.com/medikoo/ncjsm/commit/c97d4a0))
- Fix symlink type ([a371ed0](https://github.com/medikoo/ncjsm/commit/a371ed0))
- Improve naming ([81785d6](https://github.com/medikoo/ncjsm/commit/81785d6))
- Improve var name ([523498a](https://github.com/medikoo/ncjsm/commit/523498a))
- Improve var naming ([e48b5f0](https://github.com/medikoo/ncjsm/commit/e48b5f0))
- Maintain support for Node.js v6 ([3341664](https://github.com/medikoo/ncjsm/commit/3341664))
- Make symlink tests portable to windows ([0b57b2a](https://github.com/medikoo/ncjsm/commit/0b57b2a))
- Refactor to async/await ([6f20188](https://github.com/medikoo/ncjsm/commit/6f20188))
- Rename util ([55a6d6f](https://github.com/medikoo/ncjsm/commit/55a6d6f))
- Skip symlink tests if not capable to create them ([53cc946](https://github.com/medikoo/ncjsm/commit/53cc946))

### BREAKING CHANGES

- 'resolve', and 'resolve/sync' utils now resolve with objects that
  expose path on `targetPath` property
  (so far path was returned directly)

# [2.3.0](https://github.com/medikoo/ncjsm/compare/v2.2.0...v2.3.0) (2019-04-30)

### Features

- improve validation in isModuleNotFoundError ([8b2e641](https://github.com/medikoo/ncjsm/commit/8b2e641))

# [2.2.0](https://github.com/medikoo/ncjsm/compare/v2.1.0...v2.2.0) (2019-04-30)

### Bug Fixes

- Fix isModuleNotFound crash in Node.js v12 ([c9b9cc8](https://github.com/medikoo/ncjsm/commit/c9b9cc8))

### Features

- Bring ES3 support to isModuleNotFoundError ([e6d0132](https://github.com/medikoo/ncjsm/commit/e6d0132))

# [2.1.0](https://github.com/medikoo/ncjsm/compare/v2.0.1...v2.1.0) (2019-04-18)

### Features

- support ignoreMissing option in getDependencies ([20baf14](https://github.com/medikoo/ncjsm/commit/20baf14))

## [2.0.1](https://github.com/medikoo/ncjsm/compare/v2.0.0...v2.0.1) (2019-03-18)

### Bug Fixes

- ensure ES5 support in requireUncached ([bab908d](https://github.com/medikoo/ncjsm/commit/bab908d))

# [2.0.0](https://github.com/medikoo/ncjsm/compare/v1.6.0...v2.0.0) (2019-03-12)

### Features

- improve resolution of dynamic requires ([fa1457b](https://github.com/medikoo/ncjsm/commit/fa1457b))

### reafactor

- convert to ES2015 ([ed2aa37](https://github.com/medikoo/ncjsm/commit/ed2aa37))

### BREAKING CHANGES

- Drop support for Node.js v4 and below

# [1.6.0](https://github.com/medikoo/ncjsm/compare/v1.5.0...v1.6.0) (2019-02-07)

### Features

- rename cjs-module to ncjsm ([743b95c](https://github.com/medikoo/ncjsm/commit/743b95c))

<a name="1.5.0"></a>

# [1.5.0](https://github.com/medikoo/cjs-module/compare/v1.4.1...v1.5.0) (2018-12-28)

### Features

- improve error messaging ([ca04d59](https://github.com/medikoo/cjs-module/commit/ca04d59))

<a name="1.4.1"></a>

## [1.4.1](https://github.com/medikoo/cjs-module/compare/v1.4.0...v1.4.1) (2018-12-28)

<a name="1.4.0"></a>

# [1.4.0](https://github.com/medikoo/cjs-module/compare/v1.3.1...v1.4.0) (2018-09-14)

### Features

- isModuleNotFoundError util ([130b066](https://github.com/medikoo/cjs-module/commit/130b066))

<a name="1.3.1"></a>

## [1.3.1](https://github.com/medikoo/cjs-module/compare/v1.3.0...v1.3.1) (2018-07-26)

### Bug Fixes

- ensure full isolation in require-uncached ([090eede](https://github.com/medikoo/cjs-module/commit/090eede))

<a name="1.3.0"></a>

# [1.3.0](https://github.com/medikoo/cjs-module/compare/v1.2.2...v1.3.0) (2018-05-14)

### Features

- requireUncached util ([1f79012](https://github.com/medikoo/cjs-module/commit/1f79012))

<a name="1.2.2"></a>

## [1.2.2](https://github.com/medikoo/cjs-module/compare/v1.2.1...v1.2.2) (2017-09-18)

### Bug Fixes

- resolution of dirs referenced in main of package.json ([455ce5a](https://github.com/medikoo/cjs-module/commit/455ce5a))

<a name="1.2.1"></a>

## [1.2.1](https://github.com/medikoo/cjs-module/compare/v1.2.0...v1.2.1) (2017-06-20)

### Bug Fixes

- ensure to not resolve builtin modules ([1107e40](https://github.com/medikoo/cjs-module/commit/1107e40))

<a name="1.2.0"></a>

# [1.2.0](https://github.com/medikoo/cjs-module/compare/v1.1.0...v1.2.0) (2017-06-16)

### Features

- getDependencies utility ([af1c3d0](https://github.com/medikoo/cjs-module/commit/af1c3d0))

### Bug Fixes

- ensure proper tests resolution on windows ([4e4960b](https://github.com/medikoo/cjs-module/commit/4e4960b))

## Old Changelog

See `CHANGES`
