# `tmpdir`

Creates (on first call) and returns path to process specific temporary directory, which is:

- Created in context of system temp dir
- Is automatically cleaned up and removed on process exit

```javascript
const resolveTmpDir = require("process-utils/tmpdir");

const processTmpDir = await resolveTmpDir();

// .. Put temporary files into processTmpDir
```
