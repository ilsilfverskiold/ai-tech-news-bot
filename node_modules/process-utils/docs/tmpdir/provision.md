# `tmpdir/provision`

Creates and returns path to temporary directory which is

- Created in context of process temp dir (as created by [`tmp`](./index.md))
- Is automatically cleaned up and removed on process exit

```javascript
const provisionTmpDir = require("process-utils/tmpdir/provision");

const otherTmpDir = await provisionTmpDir();

// .. Put temporary files into otherTmpDir
```
