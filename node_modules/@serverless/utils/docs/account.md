## Utilities related to user account

_Note: Utilities aid old (to be deprecated and removed) authentication & authorization system_

User account related utilities that also interact with stored config file. Several methods depend on `sdk` parameter, which should be provided as an instance of `ServerlessSDK` from `@serverless/platform-client` library.

```javascript
const accountUtils = require('@serverless/utils/account');
```

Exposes following _async_ methods:

### `logout()`

Logs out currently logged in user. It ensures that changes are saved to config file.

### `refreshToken(sdk)`

Conditionally refreshes `idToken` for currently logged in user if needed. If `idToken` did not expire yet, it won't be refreshed.
