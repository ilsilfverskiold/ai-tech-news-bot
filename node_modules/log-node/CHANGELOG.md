# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [8.0.3](https://github.com/medikoo/log-node/compare/v8.0.2...v8.0.3) (2021-12-21)

_Maintenance Improvements_

### [8.0.2](https://github.com/medikoo/log-node/compare/v8.0.1...v8.0.2) (2021-10-22)

### Maintenance Improvements

- Remove `has-ansi` dependency due to security issues ([#6](https://github.com/medikoo/log-node/issues/6)) ([5813577](https://github.com/medikoo/log-node/commit/5813577de14e8f91fcf1f0fbae66de3437fdc0b5)) ([Gareth Jones](https://github.com/G-Rath))

### [8.0.1](https://github.com/medikoo/log-node/compare/v8.0.0...v8.0.1) (2021-09-10)

### Maintenance Improvements

- Do not apply decorators on empty message ([e2d03d7](https://github.com/medikoo/log-node/commit/e2d03d7f0e193e3e0b77f7ad9b828b07ddf12fdb))

## [8.0.0](https://github.com/medikoo/log-node/compare/v7.0.0...v8.0.0) (2021-09-02)

### ⚠ BREAKING CHANGES

- Node.js version 10 or later is required (dropped support for v6 and v8)

### Features

- Allow to customize `env` in writer constructor ([01bfaae](https://github.com/medikoo/log-node/commit/01bfaae6f6ae7454da0461d9eccc56c265a96299))

### Maintenance Improvements

- Drop support for Node.js versions below v10 ([83bba3e](https://github.com/medikoo/log-node/commit/83bba3e31b7929b5b38975f4c9671c7f3df014d6))
- Upgrade `has-ansi` to v4 ([caf610c](https://github.com/medikoo/log-node/commit/caf610cc5a80dccc30403ee9dedf9964e703367e))
- Upgrade `supports-color` to v8 ([8b6f1d5](https://github.com/medikoo/log-node/commit/8b6f1d5c77d729f6f514d265ef9d0490456f8601))
- Upgrade to `cli-color` v2 ([7ebe5f8](https://github.com/medikoo/log-node/commit/7ebe5f83341e2a125af392c09881a7331cf8fc0a))

# [7.0.0](https://github.com/medikoo/log-node/compare/v6.1.0...v7.0.0) (2019-04-10)

### Features

- upgrade to log v6 ([2c6a2ee](https://github.com/medikoo/log-node/commit/2c6a2ee))

### BREAKING CHANGES

- Drop support for log v5

# [6.1.0](https://github.com/medikoo/log-node/compare/v6.0.1...v6.1.0) (2019-04-09)

### Features

- seclude NodeLogWriter class ([2399f45](https://github.com/medikoo/log-node/commit/2399f45))

## [6.0.1](https://github.com/medikoo/log-node/compare/v6.0.0...v6.0.1) (2019-04-08)

# [6.0.0](https://github.com/medikoo/log-node/compare/v5.1.0...v6.0.0) (2019-04-08)

### Features

- upgrade configuration ot use LogWriter ([7ac81e3](https://github.com/medikoo/log-node/commit/7ac81e3))

### BREAKING CHANGES

- Removed format and formatEventMessage utilties

# [5.1.0](https://github.com/medikoo/log-node/compare/v5.0.0...v5.1.0) (2019-03-19)

### Features

- dim log timestamps ([f85a103](https://github.com/medikoo/log-node/commit/f85a103))

# [5.0.0](https://github.com/medikoo/log-node/compare/v4.0.0...v5.0.0) (2019-03-19)

### Features

- move from util to lib ([cf7ce81](https://github.com/medikoo/log-node/commit/cf7ce81))
- move from util to lib ([f8f93c5](https://github.com/medikoo/log-node/commit/f8f93c5))
- move from util to lib ([c7e3de5](https://github.com/medikoo/log-node/commit/c7e3de5))
- move from util to lib ([f9fb731](https://github.com/medikoo/log-node/commit/f9fb731))
- move from util to lib ([0d12bfa](https://github.com/medikoo/log-node/commit/0d12bfa))
- upgrde to log v5 ([2018502](https://github.com/medikoo/log-node/commit/2018502))

### BREAKING CHANGES

- Move util/resolve-format-parts.js to lib/resolve-format-parts.js
- Move util/level-prefixes.js to lib/level-prefixes.js
- Move util/get-namespace-prefix.js into lib/get-namespace-prefix.js
- Move util/format.js into lib/format.js
- util/format-event-message.js was moved to lib/format-event-message.js
- Switch from log v4 to logv5

# [4.0.0](https://github.com/medikoo/log-node/compare/v3.2.1...v4.0.0) (2019-03-18)

### Bug Fixes

- ensure private modules are in lib/private ([73b75c5](https://github.com/medikoo/log-node/commit/73b75c5))

### Code Refactoring

- upgrade to log v4 ([703815b](https://github.com/medikoo/log-node/commit/703815b))

### Features

- support LOG_TIME ([e750b82](https://github.com/medikoo/log-node/commit/e750b82))

### BREAKING CHANGES

- Switch to log v4

<a name="3.2.1"></a>

## [3.2.1](https://github.com/medikoo/log-node/compare/v3.2.0...v3.2.1) (2018-11-29)

<a name="3.2.0"></a>

# [3.2.0](https://github.com/medikoo/log-node/compare/v3.1.1...v3.2.0) (2018-11-29)

### Features

- rename to log-node ([e4209d9](https://github.com/medikoo/log-node/commit/e4209d9))

<a name="3.1.1"></a>

## [3.1.1](https://github.com/medikoo/log4-node/compare/v3.1.0...v3.1.1) (2018-10-02)

### Bug Fixes

- do not wrap raw strings that contain ansi codes ([1027877](https://github.com/medikoo/log4-node/commit/1027877))

<a name="3.1.0"></a>

# [3.1.0](https://github.com/medikoo/log4-node/compare/v3.0.0...v3.1.0) (2018-10-02)

### Features

- format util ([5d2d8fc](https://github.com/medikoo/log4-node/commit/5d2d8fc))
- seclude inspectDepth resolution to lib ([073351d](https://github.com/medikoo/log4-node/commit/073351d))
- seclude partsResolver util ([9a9b101](https://github.com/medikoo/log4-node/commit/9a9b101))
- support raw string placeholder variant ([f6fd4ac](https://github.com/medikoo/log4-node/commit/f6fd4ac))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/medikoo/log4-node/compare/v2.3.1...v3.0.0) (2018-09-28)

### Features

- rename to utils/format-event-message.js ([d3a78f5](https://github.com/medikoo/log4-node/commit/d3a78f5))
- support default namespace ([5e3c931](https://github.com/medikoo/log4-node/commit/5e3c931))

### BREAKING CHANGES

- utils/format-message.js was renamed to utils/format-event-message.js

<a name="2.3.1"></a>

## [2.3.1](https://github.com/medikoo/log4-node/compare/v2.3.0...v2.3.1) (2018-08-06)

### Bug Fixes

- do not decorate placeholders with message decorators ([dcaa9ca](https://github.com/medikoo/log4-node/commit/dcaa9ca))

<a name="2.3.0"></a>

# [2.3.0](https://github.com/medikoo/log4-node/compare/v2.2.0...v2.3.0) (2018-06-05)

### Features

- show warning logs in yellow when colors enabled ([fe7564b](https://github.com/medikoo/log4-node/commit/fe7564b))

<a name="2.2.0"></a>

# [2.2.0](https://github.com/medikoo/log4-node/compare/v2.1.1...v2.2.0) (2018-06-05)

### Features

- make error colors red when colors are enabled ([9682138](https://github.com/medikoo/log4-node/commit/9682138))
- Support logger.messageContentDecorator function ([f194169](https://github.com/medikoo/log4-node/commit/f194169))

<a name="2.1.1"></a>

## [2.1.1](https://github.com/medikoo/log4-node/compare/v2.1.0...v2.1.1) (2018-06-05)

<a name="2.1.0"></a>

# [2.1.0](https://github.com/medikoo/log4-node/compare/v2.0.0...v2.1.0) (2018-06-04)

### Bug Fixes

- use less confusing "i" symbol for notice ([8c545f5](https://github.com/medikoo/log4-node/commit/8c545f5))

### Features

- improve string formatting ([7d2ea73](https://github.com/medikoo/log4-node/commit/7d2ea73))

<a name="2.0.0"></a>

# [2.0.0](https://github.com/medikoo/log4-node/compare/v1.0.0...v2.0.0) (2018-06-01)

### BREAKING CHANGES

- Drop support for log4 v2
- Drop support for Node.js v4
- Switch formatter to rely on [sprintf-kit](https://github.com/medikoo/sprintf-kit) instead of native Node.js one
- Drop support for LOG4_COLORS env var (instead DEBUG_COLORS should be used)
- Change presentation of prefixes

- Hndler is exposed as a function and needs to be invoked:

```javascript
require("log4-nodejs")();
```

<a name="1.0.0"></a>

# 1.0.0 (2018-03-22)
