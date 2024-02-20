# `resolve-package-metadata(packageName[, options])`

Resolve metadata for provided package name.

## Supported options

- `registryUrl` - Alternative registryUrl to query
- `authToken` - Auth token for registry url

## Usage

```javascript
const resolvePackageMetadata = require("npm-registry-utilities/resolve-package-metadata");

const packageMetaData = await resolvePackageMetaData("npm-registry-utilities");
// { name: "npm-registry-utilities", 'dist-tags': { latest: ... }, versions: { ... } }
```
