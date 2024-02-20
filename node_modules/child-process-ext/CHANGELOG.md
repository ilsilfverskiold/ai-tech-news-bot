# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.1](https://github.com/medikoo/child-process-ext/compare/v2.1.0...v2.1.1) (2020-04-05)

### Bug Fixes

- Ensure to maintain dynamic resolution of cumulated buffers ([3fdeab5](https://github.com/medikoo/child-process-ext/commit/3fdeab5359b12c2cb03dce93b8ee4160425d11f8)) ([Mariusz Nowak](https://github.com/medikoo))

## [2.1.0](https://github.com/medikoo/child-process-ext/compare/v2.0.0...v2.1.0) (2019-09-03)

### Features

- Configure debug logging ([deb3ea1](https://github.com/medikoo/child-process-ext/commit/deb3ea1))
- Expose std & stdBuffer properties (merged std output) ([dabf7ca](https://github.com/medikoo/child-process-ext/commit/dabf7ca))
- Improve exit error message ([f52dfd9](https://github.com/medikoo/child-process-ext/commit/f52dfd9))
- Introduce `shouldCloseStdin` option ([ecddc13](https://github.com/medikoo/child-process-ext/commit/ecddc13))

### Tests

- Improve assert method ([0237539](https://github.com/medikoo/child-process-ext/commit/0237539))
- Improve test case ([5831f6d](https://github.com/medikoo/child-process-ext/commit/5831f6d))
- Improve test name ([448b6e5](https://github.com/medikoo/child-process-ext/commit/448b6e5))
- improve tests ([33043d8](https://github.com/medikoo/child-process-ext/commit/33043d8))
- Simplify ([cc26813](https://github.com/medikoo/child-process-ext/commit/cc26813))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/medikoo/child-process-ext/compare/v1.0.0...v2.0.0) (2019-01-18)

### Features

- decorate std streams with promise behavior ([bbf5dc1](https://github.com/medikoo/child-process-ext/commit/bbf5dc1))
- improve split handling ([3a73750](https://github.com/medikoo/child-process-ext/commit/3a73750))

### BREAKING CHANGES

- Trailing non-empty line is now emittted

<a name="1.0.0"></a>

# 1.0.0 (2019-01-11)

### Bug Fixes

- expose programmer errors as promise rejections ([25db17b](https://github.com/medikoo/child-process-ext/commit/25db17b))
- windows requires double quotes ([69f67f5](https://github.com/medikoo/child-process-ext/commit/69f67f5))

### Features

- "split" option ([1b31933](https://github.com/medikoo/child-process-ext/commit/1b31933))
- expose current std buffers on promise ([9541e99](https://github.com/medikoo/child-process-ext/commit/9541e99))
- expose std buffers at better names ([e4e0962](https://github.com/medikoo/child-process-ext/commit/e4e0962))
- expose std streams directly on promise ([a2751c2](https://github.com/medikoo/child-process-ext/commit/a2751c2))
- improve arguments handling ([41bb8e9](https://github.com/medikoo/child-process-ext/commit/41bb8e9))
