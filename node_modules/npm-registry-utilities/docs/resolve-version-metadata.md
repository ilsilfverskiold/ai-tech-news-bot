# `resolve-version-metadata(packageName[, versionRange[, options]])`

Resolve metadata for provided package name.

`versionRange` defaults to `latest`

## Supported options

_Same as for [`resolve-package-metadata`](docs/resolve-package-metadata.md)_

## Usage

```javascript
const resolveVersionMetadata = require("npm-registry-utilities/resolve-version-metadata");

const versionMetaData = await resolvePackageMetaData("npm-registry-utilities", "1");
// Version metadata for latest v1 release
// { name: "npm-registry-utilities", version: .... dist: ..., .... } }
```
