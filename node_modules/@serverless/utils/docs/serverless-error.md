## Generic class to report user errors in Serverless Inc. CLI products

### `ServerlessError(message, code, options = { ... })`

- `message` - Error message
- `code` - Error code
- Supported `options` (all optional):
  - `decoratedMessage` - Eventual decorated (with ANSI styling) version of a message to be passed throught to `stdout` as is

```javascript
const ServerlessError = require('@serverless/utils/serverless-error');
...

new ServerlessError("Service cannot be deployed in given region", 'REGION_MISMATCH');
```
