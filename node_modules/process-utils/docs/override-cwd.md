# `override-cwd`

Overrides process current working directory (as resolved via `process.cwd()`) until returned `restoreCwd()` is called. Helpful when testing modules which behavior relies on current working directory resolution

```javascript
const overrideCwd = require("process-utils/override-cwd");

const { restoreCwd, originalCwd } = overrideCwd("/some/new/test/cwd");
// Exposes original `process.argv`
console.log(originalCwd);
//
console.log(process.cwd()); // /some/new/test/cwd

// Provides a callback to restore previous state
restoreCwd();
```

Optionally _callback_ can be passed to `overrideCwd`, it's invoked immediately, and only for a time of it's execution current working directory is overriden. if _callback_ returns _thenable_ then current working directly is restored when given _thenable_ resolves.
