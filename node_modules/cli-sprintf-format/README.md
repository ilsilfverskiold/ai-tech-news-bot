[![Build status][build-image]][build-url]
[![Tests coverage][cov-image]][cov-url]
[![npm version][npm-image]][npm-url]

# cli-sprintf-format

## CLI dedicated sprintf formatter

An improved version of [util.formatWithOptions](https://nodejs.org/api/util.html#util_util_formatwithoptions_inspectoptions_format_args)

- Provides more reliable type resolution and error handling
- Detects color support (via [supports-color](https://github.com/chalk/supports-color#readme))
- Ensures colored (if supported) output not only for the inspected objects but also for primitive vaulues
- Colored JSON (`%j`) formatting
- Object inspection depth defaults to `4`, but can be overriden via `FORMAT_INSPECT_DEPTH` environment variable
- For `%s` strings are passed through [`inspect`](https://nodejs.org/api/util.html#util_util_inspect_object_options) formatter therefore appear colored (if supported) and eventual multiline content appears inline. To escape that behavior `%#s` should be used instead

### Installation

```bash
npm install cli-sprintf-format
```

### Usage

```javascript
const cliFormat = require("cli-sprintf-format");

console.log(cliFormat("Some %s with %d count", "foo", 12)); // Some foo with 12 count
```

### Tests

```bash
npm test
```

[build-image]: https://github.com/medikoo/cli-sprintf-format/workflows/Integrate/badge.svg
[build-url]: https://github.com/medikoo/cli-sprintf-format/actions?query=workflow%3AIntegrate
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/cli-sprintf-format.svg
[cov-url]: https://codecov.io/gh/medikoo/cli-sprintf-format
[npm-image]: https://img.shields.io/npm/v/cli-sprintf-format.svg
[npm-url]: https://www.npmjs.com/package/cli-sprintf-format
