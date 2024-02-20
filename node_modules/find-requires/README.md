[![Build status][nix-build-image]][nix-build-url]
[![Windows status][win-build-image]][win-build-url]
![Transpilation status][transpilation-image]
[![npm version][npm-image]][npm-url]

# find-requires – Find all require() calls.

Made for [modules-webmake](https://github.com/medikoo/modules-webmake). Fast [esniff](https://github.com/medikoo/esniff#esniff) based implementation of require calls parser.

## Example

foo.js:

```javascript
var one = require("one");
var two = require("two");
var slp = require("some/long" + "/path");
var wrong = require(cannotTakeThat);
```

program.js:

```javascript
var fs = require("fs");
var findRequires = require("find-requires");

var src = fs.readFileSync("foo.js", "utf-8");

console.log(findRequires(src)); // => ['one', 'two', 'some/long/path'];

// or we can get more detailed data with `raw` option:
console.log(findRequires(src, { raw: true })); /* => [
	{ value: 'one', raw: '\'one\'', point: 19, line: 1, column: 19 },
	{ value: 'two', raw: '\'two\'', point: 45, line: 2, column: 19 },
	{ value: 'some/long/path', raw: '\'some/long\' +\n\t\t\t\t\t\t\'/path\'',
		point: 71, line: 3, column: 19  },
	{ raw: 'cannotTakeThat', point: 121, line: 5, column: 21 }
] */

// We can also ensure some specific cases of dynamic requires code with some setup code injection
console.log(
	findRequires("require(__dirname + '/foo.js')", {
		setupCode: `const __dirname = ${ JSON.stringify(__dirname) }`
	})
);
```

## CLI Example

```
> npm install -g find-requires
```

Find all requires in a file:

```
> find-requires file1.js
test1.js:3:LIB + '/test2'
test1.js:4:fs
```

Find all places the fs module is required: `find-requires -m fs $(find . -name '*.js')`

## Tests

    $ npm test

[nix-build-image]: https://semaphoreci.com/api/v1/medikoo-org/find-requires/branches/master/shields_badge.svg
[nix-build-url]: https://semaphoreci.com/medikoo-org/find-requires
[win-build-image]: https://ci.appveyor.com/api/projects/status/7i22v2m9om08fklw?svg=true
[win-build-url]: https://ci.appveyor.com/project/medikoo/find-requires
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/find-requires.svg
[npm-url]: https://www.npmjs.com/package/find-requires
