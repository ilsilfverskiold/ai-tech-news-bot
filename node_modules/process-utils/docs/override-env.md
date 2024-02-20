# `override-env`

Overrides `process.env` until returned `restoreEnv()` is called. Helpful when testing modules which behavior relies on environment settings.

```javascript
const overrideEnv = require("process-utils/override-env");

process.env.FOO = "bar";
const { restoreEnv, originalEnv } = overrideEnv();
// Exposes original `process.env`
console.log(originalEnv.FOO); // "bar";
// Current `process.env` points other (empty plain) object
console.log(process.env.FOO); // undefined;

// Provides a callback to restore previous state
restoreEnv();
console.log(process.env.FOO); // "bar"
```

Optionally _callback_ can be passed to `overrideEnv`, it's invoked immediately, and only for a time of it's execution `process.env` is overriden:

```javascript
const overrideEnv = require("process-utils/override-env");

process.env.FOO = "bar";
// Passed callback is invoked immediately
overrideEnv(originalEnv => {
  // Exposes original `process.env`
  console.log(originalEnv.FOO); // "bar";
  // Current `process.env` points other (empty plain) object
  console.log(process.env.FOO); // undefined;
});
// After return the state is restored
console.log(process.env.FOO); // "bar"
```

However if _callback_ returns _thenable_ then `process.env` is restored when given _thenable_ resolves:

```javascript
const overrideEnv = require("process-utils/override-env");

process.env.FOO = "bar";
overrideEnv(() => new Promise(resolve => setTimeout(resolve, 100)));
// Still process.env is not resolved
console.log(process.env.FOO); // undefined
setTimeout(() => {
  // Original process.env is back
  console.log(process.env.FOO); // "bar"
}, 110);
```

## Supported options

### whitelist `iterable` (default: `[]`)

Provide a whitelist of env vars to expose on a copy

```javascript
process.env.FOO = "bar";
process.env.LOREM = "ipsum";
const { restoreEnv, originalEnv } = overrideEnv({ whitelist: ["FOO"] });
// Exposes onlywhitelisted props
console.log(process.env.FOO); // "bar"
console.log(process.env.LOREM); // undefined
```

### asCopy `boolean` (default: `false`)

Override env as copy of original

```javascript
process.env.FOO = "bar";
const { restoreEnv, originalEnv } = overrideEnv({ asCopy: true });
// Exposes process.env props
console.log(process.env.FOO); // "bar"

process.env.BAR = "elo";
// Further updates doesn't affect cached original env
console.log(originalEnv.BAR); // undefined

// Provides a callback to restore previous state
restoreEnv();
console.log(process.env.BAR); // undefined
```

### veriables `object` (default: `null`)

Variables to be exposed on overriden `process.env`

```javascript
process.env.FOO = "bar";
const { restoreEnv, originalEnv } = overrideEnv({ variables: { ELO: 12 } });
// Exposes process.env props
console.log(process.env.FOO); // undefined
console.log(process.env.ELO); // "12"

restoreEnv();
```
