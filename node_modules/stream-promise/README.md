[![*nix build status][nix-build-image]][nix-build-url]
[![Windows build status][win-build-image]][win-build-url]
[![Tests coverage][cov-image]][cov-url]
![Transpilation status][transpilation-image]
[![npm version][npm-image]][npm-url]

# stream-promise

## Convert any [Stream](https://nodejs.org/api/stream.html#stream_stream) instance to thenable

So it can be consumed both as a promise and as a stream

### Installation

```bash
npm install stream-promise
```

# Usage

Stream must be either readable or writable.

In case of readable streams, promise resolves with concatenated output, in case of writable streams resolve with `undefined`

To achieve expected result stream should be converted immediately after initialization.

```javascript
const streamPromise = require("stream-promise");

streamPromise(someReadableStream);

someReadableStream.then(result => { console.log("Concatenated stream output", result); });

streamPromise(someWritabletream);

someReadableStream.then(result => { console.log("Cumulated stream output", result); });
```

Already emitted data is accessible at `emittedData` property

## Non-destructive way

Sepearate promise (without touching stream object) can be created with `to-promise` util:

```javascript
const streamToPromise = require("stream-promise/to-promise");

const someReadableStreamPromise = streamPromiseTo(someReadableStream);

someReadableStreamPromise.then(result => { console.log("Concatenated stream output", result); });
```

## Supported options

### noCollect `boolean` (default: `false`)

Applicable to _readable_ streams. Set to true, if it's not intended to gather stream result and resolve with it.

Then the only purpose of promise would be to indicate a moment when data stream is finalized

### Tests

```bash
npm test
```

[nix-build-image]: https://semaphoreci.com/api/v1/medikoo-org/stream-promise/branches/master/shields_badge.svg
[nix-build-url]: https://semaphoreci.com/medikoo-org/stream-promise
[win-build-image]: https://ci.appveyor.com/api/projects/status/2ihsys269r29l2ol?svg=true
[win-build-url]: https://ci.appveyor.com/api/project/medikoo/stream-promise
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/stream-promise.svg
[cov-url]: https://codecov.io/gh/medikoo/stream-promise
[transpilation-image]: https://img.shields.io/badge/transpilation-free-brightgreen.svg
[npm-image]: https://img.shields.io/npm/v/stream-promise.svg
[npm-url]: https://www.npmjs.com/package/stream-promise
