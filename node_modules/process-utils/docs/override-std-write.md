# `override-stdout-write` & `override-stderr-write`

Override `process.stdout.write` or `process.stderr.write` with provided alternative

```javascript
const overrideStdoutWrite = require("process-utils/override-stdout-write");

// Configure decorator that will strip ANSI codes
const {
  originalStdoutWrite, // Original `write` bound to `process.stdout`
  originalWrite, // Original `write` on its own
  restoreStdoutWrite // Allows to restore previous state
} = overrideStdoutWrite((data, superWrite) => superWrite(stripAnsi(data)));

process.stdout.write(someAnsiCodeDecoratedString); // will be output with ANSI codes stripped out

// Restore previous state
restoreStdoutWrite();
```

Optionally _callback_ can be passed to `override*`, it's invoked immediately, and only for a time of it's execution `stream.write` is overriden. if _callback_ returns _thenable_ then `stream.write` is restored when given _thenable_ resolves.
