# `override-argv`

Overrides `process.argv` until returned `restoreArgv()` is called. Helpful when testing modules which behavior relies on command line arguments

```javascript
const overrideArgv = require("process-utils/override-argv");

const { restoreArg, originalArgv } = overrideEnv();
// Exposes original `process.argv`
console.log(originalArgv);
// Counterpart by default contains only first item from original argv
console.log(process.argv);

// Provides a callback to restore previous state
restoreArgv();
```

Optionally _callback_ can be passed to `overrideArgv`, it's invoked immediately, and only for a time of it's execution `process.argv` is overriden. if _callback_ returns _thenable_ then `process.argv` is restored when given _thenable_ resolves.

## Supported options

### sliceAt `integer` (default: `1`)

Til which index should original `process.argv` be exposed on counterpart

### args `iterable` (default: `[]`)

Arguments to add to counterpart `process.argv`
