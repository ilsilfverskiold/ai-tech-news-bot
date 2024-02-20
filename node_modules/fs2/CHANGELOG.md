# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.9](https://github.com/medikoo/fs2/compare/v0.3.8...v0.3.9) (2020-11-19)

### Features

- rmdirSync util ([3c50c17](https://github.com/medikoo/fs2/commit/3c50c17198bd77e52c2889e3ce05161d790250a8))

### [0.3.8](https://github.com/medikoo/fs2/compare/v0.3.7...v0.3.8) (2020-04-27)

### Bug Fixes

- Fix `mode` normalization in `fs.access` ([00f2a52](https://github.com/medikoo/fs2/commit/00f2a52b139576b5b5adcec7c3c01bb84b905076))

### [0.3.7](https://github.com/medikoo/fs2/compare/v0.3.6...v0.3.7) (2019-11-07)

### Features

- 'silent' option for mkdir ([e3fe863](https://github.com/medikoo/fs2/commit/e3fe863))

### [0.3.6](https://github.com/medikoo/fs2/compare/v0.3.5...v0.3.6) (2019-09-26)

### Bug Fixes

- Ensure to not leave open file descriptors when write crashes ([cf8ef7e](https://github.com/medikoo/fs2/commit/cf8ef7e))

### Features

- Expose debug stats in descriptors handler ([cdcac3f](https://github.com/medikoo/fs2/commit/cdcac3f))

### [0.3.5](https://github.com/medikoo/fs2/compare/v0.3.4...v0.3.5) (2019-07-10)

### Features

- 'append' mode for chmod ([afa7aaa](https://github.com/medikoo/fs2/commit/afa7aaa))

<a name="0.3.4"></a>

## [0.3.4](https://github.com/medikoo/fs2/compare/v0.3.3...v0.3.4) (2019-02-04)

### Features

- 'force' option for copy ([85a3560](https://github.com/medikoo/fs2/commit/85a3560))

<a name="0.3.3"></a>

## [0.3.3](https://github.com/medikoo/fs2/compare/v0.3.2...v0.3.3) (2019-02-04)

### Features

- 'access' util ([d85f934](https://github.com/medikoo/fs2/commit/d85f934))
- hasAccess util ([8c53ea9](https://github.com/medikoo/fs2/commit/8c53ea9))

<a name="0.3.2"></a>

## [0.3.2](https://github.com/medikoo/fs2/compare/v0.3.1...v0.3.2) (2019-02-04)

### Bug Fixes

- readdir 'loose' option handling with depth: Infinity ([f2c19ac](https://github.com/medikoo/fs2/commit/f2c19ac))

<a name="0.3.1"></a>

## [0.3.1](https://github.com/medikoo/fs2/compare/v0.3.0...v0.3.1) (2019-01-31)

### Features

- **readdir:** loose option ([7b2a5e7](https://github.com/medikoo/fs2/commit/7b2a5e7))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/medikoo/fs2/compare/v0.2.21...v0.3.0) (2019-01-07)

### Bug Fixes

- Ensure git ignore resolution works as expected ([c5d68fb](https://github.com/medikoo/fs2/commit/c5d68fb))

### BREAKING CHANGES

- Due to switch to 'ignore' not supporting Node below v6,
  drop support for old verions of Node.js.

<a name="0.2.21"></a>

## [0.2.21](https://github.com/medikoo/fs2/compare/v0.2.20...v0.2.21) (2018-11-15)

### Bug Fixes

- 'loose' option handling on windows ([3788ebf](https://github.com/medikoo/fs2/commit/3788ebf))

<a name="0.2.20"></a>

## [0.2.20](https://github.com/medikoo/fs2/compare/v0.2.19...v0.2.20) (2018-11-07)

### Bug Fixes

- **copyDir:** symlink copying ([c0e4a6f](https://github.com/medikoo/fs2/commit/c0e4a6f))

<a name="0.2.19"></a>

## [0.2.19](https://github.com/medikoo/fs2/compare/v0.2.18...v0.2.19) (2018-10-31)

### Bug Fixes

- **symlink:** for symlink we should not fully resolve link path ([ae17653](https://github.com/medikoo/fs2/commit/ae17653))

<a name="0.2.18"></a>

## [0.2.18](https://github.com/medikoo/fs2/compare/v0.2.17...v0.2.18) (2018-10-31)

### Bug Fixes

- remove problematic stream.destroy() ([ceb67b9](https://github.com/medikoo/fs2/commit/ceb67b9))
- **copy:** validate destination existence ([7662c1e](https://github.com/medikoo/fs2/commit/7662c1e))
- **copyDir:** fix duplicate file copying ([41ff83b](https://github.com/medikoo/fs2/commit/41ff83b))

<a name="0.2.17"></a>

## [0.2.17](https://github.com/medikoo/fs2/compare/v0.2.16...v0.2.17) (2018-10-31)

### Bug Fixes

- **copyDir:** throw if destination path exists ([812fdfb](https://github.com/medikoo/fs2/commit/812fdfb))

<a name="0.2.16"></a>

## [0.2.16](https://github.com/medikoo/fs2/compare/v0.2.15...v0.2.16) (2018-10-31)

### Features

- copyDir util ([2f45d62](https://github.com/medikoo/fs2/commit/2f45d62))

<a name="0.2.15"></a>

## [0.2.15](https://github.com/medikoo/fs2/compare/v0.2.14...v0.2.15) (2018-10-25)

### Bug Fixes

- **readlink:** improve loose option handling ([b54f193](https://github.com/medikoo/fs2/commit/b54f193))
- improve arguments handling ([c32f340](https://github.com/medikoo/fs2/commit/c32f340))
- **lstat:** fix loose option handling ([889b829](https://github.com/medikoo/fs2/commit/889b829))

### Features

- isDirectory util ([835b4a9](https://github.com/medikoo/fs2/commit/835b4a9))

<a name="0.2.14"></a>

## [0.2.14](https://github.com/medikoo/fs2/compare/v0.2.13...v0.2.14) (2018-10-24)

### Bug Fixes

- **readlink:** fix support for loose option on existing non-symlinks ([3c52970](https://github.com/medikoo/fs2/commit/3c52970))

<a name="0.2.13"></a>

## [0.2.13](https://github.com/medikoo/fs2/compare/v0.2.12...v0.2.13) (2018-10-24)

### Bug Fixes

- require path ([6aa87f7](https://github.com/medikoo/fs2/commit/6aa87f7))

<a name="0.2.12"></a>

## [0.2.12](https://github.com/medikoo/fs2/compare/v0.2.11...v0.2.12) (2018-10-24)

### Features

- readlink util ([c5c63c7](https://github.com/medikoo/fs2/commit/c5c63c7))

<a name="0.2.11"></a>

## [0.2.11](https://github.com/medikoo/fs2/compare/v0.2.10...v0.2.11) (2018-10-23)

### Features

- introduce realpath ([727e7b8](https://github.com/medikoo/fs2/commit/727e7b8))

<a name="0.2.10"></a>

## [0.2.10](https://github.com/medikoo/fs2/compare/v0.2.9...v0.2.10) (2018-09-14)

### Bug Fixes

- support for very old versions of Node.js ([73bc389](https://github.com/medikoo/fs2/commit/73bc389))

### Features

- rm util, removes either file or directory ([6733df6](https://github.com/medikoo/fs2/commit/6733df6))

<a name="0.2.9"></a>

## [0.2.9](https://github.com/medikoo/fs2/compare/v0.2.8...v0.2.9) (2018-09-13)

### Features

- support "loose" option in stat and lstat ([76306c4](https://github.com/medikoo/fs2/commit/76306c4))

<a name="0.2.8"></a>

## [0.2.8](https://github.com/medikoo/fs2/compare/v0.2.7...v0.2.8) (2018-09-07)

### Features

- support `intermediate` option in symlink ([5846d47](https://github.com/medikoo/fs2/commit/5846d47))

<a name="0.2.7"></a>

## [0.2.7](https://github.com/medikoo/fs2/compare/v0.2.6...v0.2.7) (2017-09-05)

### Bug Fixes

- bring back node v0.12 support ([370fa80](https://github.com/medikoo/fs2/commit/370fa80))

<a name="0.2.6"></a>

## [0.2.6](https://github.com/medikoo/fs2/compare/v0.2.5...v0.2.6) (2017-06-19)

<a name="0.2.5"></a>

## [0.2.5](https://github.com/medikoo/fs2/compare/v0.2.4...v0.2.5) (2017-06-16)

### Features

- "loose" option for fs.copy ([885cba7](https://github.com/medikoo/fs2/commit/885cba7))
- resolve successful copy with `true` ([72d4961](https://github.com/medikoo/fs2/commit/72d4961))

## Old Changelog

See `CHANGES`
