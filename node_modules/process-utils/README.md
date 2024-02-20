[![*nix build status][nix-build-image]][nix-build-url]
[![Windows build status][win-build-image]][win-build-url]
[![Tests coverage][cov-image]][cov-url]
![Transpilation status][transpilation-image]
[![npm version][npm-image]][npm-url]

# process-utils

## Utilities for [Node.js `process`](https://nodejs.org/api/process.html) handling

### Installation

```bash
npm install process-utils
```

### Available utilities

- [`create-env`](docs/create-env.md) - Create `env` instance (object that reflects `process.env` interface)
- [`override-argv`](docs/override-argv.md) - Override `process.argv` temporarily
- [`override-cwd`](docs/override-cwd.md) - Override `process.cwd()` temporarily
- [`override-env`](docs/override-env.md) - Override `process.env` temporarily
- [`override-stdout-write` & `override-stderr-write`](docs/override-std-write.md) - Override `process.std*.write` method temporarily
- **tmpdir**
  - [`tmpdir`](docs/tmpdir/index.md) - Creates (on first call) and returns path to process specific temporary directory
  - [`tmpdir/provision`](docs/tmpdir/provision.md) - Creates and returns path to new temp directory, placed in context of process specific temporary directory

### Tests

```bash
npm test
```

[nix-build-image]: https://semaphoreci.com/api/v1/medikoo-org/process-utils/branches/master/shields_badge.svg
[nix-build-url]: https://semaphoreci.com/medikoo-org/process-utils
[win-build-image]: https://ci.appveyor.com/api/projects/status/mgttc0h68grk2i6s?svg=true
[win-build-url]: https://ci.appveyor.com/api/projects/status/mgttc0h68grk2i6s
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/process-utils.svg
[cov-url]: https://codecov.io/gh/medikoo/process-utils
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/process-utils.svg
[npm-url]: https://www.npmjs.com/package/process-utils
