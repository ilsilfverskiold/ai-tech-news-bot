[![npm version][npm-image]][npm-url]

# essentials

## Essential initialization for every JavaScript process, ensures that:

#### Error stack traces list all stack frames

Affects all major engines, aside Firefox, in which it's not adjustable and hardcoded to 128.

#### Unhandled promise rejections are exposed as uncaught exceptions

Affects all V8 based engines (so Chrome and Node.js) and Microsoft Edge

In other engines it is recommended to rely on some `Promise` polyfill, which ensures unhandled rejections are being communicated with `unhandledrejection` events on global object.

### Installation

```bash
npm install essentials
```

### Usage

At top of main (entry) module simply require

```javascript
require("essentials");
```

[npm-image]: https://img.shields.io/npm/v/essentials.svg
[npm-url]: https://www.npmjs.com/package/essentials
