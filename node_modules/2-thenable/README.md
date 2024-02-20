[![*nix build status][nix-build-image]][nix-build-url]
[![Windows build status][win-build-image]][win-build-url]
[![Tests coverage][cov-image]][cov-url]
![Transpilation status][transpilation-image]

# 2-thenable

## Convert object into a thenable

Useful when we want to imply an asynchronous representation onto some non-promise object.

Having that target object can be combined into promise chains or async/await syntax.
One use case would be turning a stream instance so it's also a promise.

### Installation

```bash
npm install 2-thenable
```

### How it works

Utility takes `target` and `promise` arguments. `target` is object to be extended with `then`, `catch` and `finally` methods.
While `promise` is expected to be a native promise instance that reflects resolution which should be mapped onto `target`

# Usage

Example of converting stream to thenable

```javascript
const toThenable = require("2-thenable");

// Example of converting a simple utf8 string stream to thenable
toThenable(stream, new Promise((resolve, reject) => {
	let result = '';
	stream.on('error', reject);
	stream.on('data', data => (result += data));
	stream.on('end', () => resolve(result));
});

stream.then(result => {
	console.log("Cumulated string data", result);
});
```

### Tests

```bash
npm test
```

[nix-build-image]: https://semaphoreci.com/api/v1/medikoo-org/2-thenable/branches/master/shields_badge.svg
[nix-build-url]: https://semaphoreci.com/medikoo-org/2-thenable
[win-build-image]: https://ci.appveyor.com/api/projects/status/?svg=true
[win-build-url]: https://ci.appveyor.com/api/project/medikoo/2-thenable
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/2-thenable.svg
[cov-url]: https://codecov.io/gh/medikoo/2-thenable
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/2-thenable.svg
