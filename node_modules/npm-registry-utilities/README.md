[![Build status][build-image]][build-url]
[![Tests coverage][cov-image]][cov-url]
[![npm version][npm-image]][npm-url]

# npm-registry-utilities

## Utilities for retrieving data from npm registry

### Installation

```bash
npm install npm-registry-utilities
```

### Available utilities

- [`resolve-package-metadata`](docs/resolve-package-metadata.md) - Resolves meta data for given package name
- [`resolve-version-metadata`](docs/resolve-version-metadata.md) - Resolves meta data for version of given package name that matches provided version range

### Tests

```bash
npm test
```

[build-image]: https://github.com/medikoo/npm-registry-utilities/workflows/Integrate/badge.svg
[build-url]: https://github.com/medikoo/npm-registry-utilities/actions?query=workflow%3AIntegrate
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/npm-registry-utilities.svg
[cov-url]: https://codecov.io/gh/medikoo/npm-registry-utilities
[npm-image]: https://img.shields.io/npm/v/npm-registry-utilities.svg
[npm-url]: https://www.npmjs.com/package/npm-registry-utilities
