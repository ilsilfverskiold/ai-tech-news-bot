[![Build status][build-image]][build-url]
[![Tests coverage][cov-image]][cov-url]
[![npm version][npm-image]][npm-url]

# ncjsm

## (Node.js) CJS modules resolver

Environment agnostic (Node.js) CJS modules resolver.  
It implements a _strict_ version of Node.js modules resolution logic, differences are as follows:

- [Loading from global folders](https://nodejs.org/api/all.html#all_loading_from_the_global_folders) is not supported
- Only Unix path separators (`/`) are supported in require's _path_ arguments (_Background: even though Node.js internally seems to follow Windows path separator in Windows environment, it won't work in \*nix environments, and even in Window env it's [not reliable](https://github.com/nodejs/node/issues/6049) so by all means should be avoided_)
- There's no awareness of node.js [core modules](https://nodejs.org/api/all.html#all_core_modules)
  e.g. `resolve(dir, 'fs')` will naturally result with _null_

### Installation

    $ npm install ncjsm

### API

#### getResolver(extensions, confirmFile, resolvePackageMain)

For provided configuration, returns a CJS modules resolver:

- **extensions** - List of supported file extensions in order of singificance, e.g. for Node.js it would be `['.js', '.json', '.node']`
- **confirmFile** - a `confirmFile(filepath)` function. Confirms whether there's a module at provided (not normalized, absolute) file path. Returns promise-like object which resolves with either normalized full path of a module or null (if there's no module for given path).  
  Although result is expected to be a promise-like object, resolution can be synchronous.
- **resolvePackageMain** - a `resolvePackageMain(dirpath)` function. Returns value of _package.json_'s `main` property for given path. Returns promise-like object which resolves with either resolved value, or null, when either `package.json` file was not found, or it didn't have _main_ property.  
  Same as with `confirmFile` resolution can be synchronous.

#### resolve(dir, path)

_Node.js resolver_

Asynchronously resolves module path against provided directory path.
Returns promise.
If module is found, then promise resolves with an object, containing two properties:

- `targetPath` - A path at which module was resolved
- `realPath` - Real path of resolved module (if targetPath involves symlinks then realPath will be different)

If no matching module was found, promise is rejected with `MODULE_NOT_FOUND` error (unless `silent: true` is passed with options (passed as third argument), then it resolves with `null`)

```javascript
const resolve = require("ncjsm/resolve");

// Asynchronously resolve path for 'foo' module against current path
resolve(__dirname, "foo").then(
  function (pathData) {
    // 'foo' module found at fooModulePath
  },
  function (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      // 'foo' module doesn't exist
    }
  }
);

// `silent` option, prevents module not found rejections:
resolve(__dirname, "foo", { silent: true }).then(function (pathData) {
  if (pathData) {
    // 'foo' module found at fooModulePath
  } else {
    // 'foo' module doesn't exist
  }
});
```

#### resolveSync(dir, path)

_Node.js resolver_

Synchronously resolves module path against provided directory path. Otherwise works same as `resolve`

```javascript
const resolveSync = require("ncjsm/resolve/sync");

// Synchronously resolve path for 'foo' module against current path
let fooModulePathData;
try {
  fooModulePathData = resolveSync(__dirname, "foo");
  // 'foo' module found at fooModulePath
} catch (error) {
  if (error.code === "MODULE_NOT_FOUND") {
    // 'foo' module doesn't exist
  }
}

fooModulePathData = resolveSync(__dirname, "foo", { silent: true });
if (fooModulePathData) {
  // 'foo' module found
} else {
  // 'foo' module doesn't exist
}
```

#### requireUnached([moduleIds, ]callback)

Create temporary environment where `require` of specific modules will not resolved the eventually cached verions

```javascript
var requireUncached = require("ncjsm/require-uncached");

const firstCopyOfModule1 = require("./module1");

var secondCopyOfModule2 = requireUnached([require.resolve("./module1")], function () {
  return require("./module1");
});

console.log(firstCopyOfModule1 === secondCopyOfModule2); // false
```

Alternatively we may resolve callback in completely cleared require cache, for that `moduleIds` argument should be skipped

```javascript
var requireUncached = require("ncjsm/require-uncached");

const firstCopyOfModule1 = require("./module1");

var secondCopyOfModule2 = requireUnached(function () { return require("./module1"); });

console.log(firstCopyOfModule1 === secondCopyOfModule2); // false
```

#### isPackageRoot(dirPath)

Whether provided path is a root of a package

```javascript
var isPackageRoot = require("ncjsm/is-package-root");

isPackageRoot(dirPath).done(function (isRoot) {
  if (isRoot) {
    // Provided path is package root
  }
});
```

#### resolvePackageRoot(dirPath)

Resolve package root path for provided path. It is about resolution of first upper package root

```javascript
var resolvePackageRoot = require("ncjsm/resolve-package-root");

resolvePackageRoot(dirPath).done(function (root) {
  if (!root) {
    // Provided path is not located in any package
  }
});
```

#### resolveProjectRoot(dirPath)

Resolve project root path for provided path. It is about resolution of topmost package root for given path

```javascript
var resolveProjectRoot = require("ncjsm/resolve-project-root");

resolveProjectRoot(dirPath).done(function (root) {
  if (!root) {
    // Provided path is not located in any project
  }
});
```

#### getDependecies(modulePath, options = { ... })

Resolve all module dependencies. Returns promise that resolves with an array of paths, that includes path to input module and paths to all its dependencies (it includes deep dependencies, so also dependencies of the dependencies).

Paths to native Node.js modules are ignored.

```javascript
var getDependencies = require("ncjsm/get-dependencies");

getDependencies(modulePath).done(function (deps) {
  console.log(deps); // e.g. [pathToModulePath, pathToDep1, pathToDep2, ...pathToDepn]
});
```

##### Supported `options`

###### `ignoreMissing: false`

If file for given module cannot be found then error is thrown. Set this to `true` to simply ignore not found modules

###### `ignoreExternal: false`

By default all paths to all required modules are resolved. Resolution scope may be narrowed only to modules from same package (referenced via relative path), by settung this option to `true`

## Tests [![Build Status](https://travis-ci.org/medikoo/ncjsm.svg)](https://travis-ci.org/medikoo/ncjsm)

    $ npm test

[build-image]: https://github.com/medikoo/ncjsm/workflows/Integrate/badge.svg
[build-url]: https://github.com/medikoo/ncjsm/actions?query=workflow%3AIntegrate
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/ncjsm.svg
[cov-url]: https://codecov.io/gh/medikoo/ncjsm
[npm-image]: https://img.shields.io/npm/v/ncjsm.svg
[npm-url]: https://www.npmjs.com/package/ncjsm
