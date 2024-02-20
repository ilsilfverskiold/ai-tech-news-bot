# log-reporters

Environment specific reporters

## log-reporters/node

Node.js based CLI dedicated reporter.

If intention is to display logs (as written with logging interfaces exposed at `log` util), this module needs to be loaded as one of the first things in the main process.

_CLI main module:_

```javascript
#!/usr/bin/env node

'use strict';

require('@serverless/utils/log-reporters/node');

// Now all written logs will be displayed in a console per SLS_LOG_LEVEL and SLS_LOG_DEBUG settings
```

#### Log levels

For event logs, by default `debug` and `info` level logs are hidden.

To reveal all `info` logs (verbose mode) add `--verbose` flag

To reveal `debug` logs add `--debug=<namespace>` flag. All debug logs can be observed via `--debug=*` flag
