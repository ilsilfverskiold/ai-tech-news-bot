## Serverless Inc. authentication utilities

### `login`

Initialize login session (which opens login window in a browser). After user logs in, CLI receives refresh token, which in furtger turn can be used to [retrieve short living id tokens (for further interaction with Serverless Inc. API)](#resolveidtoken)

```javascript
const login = require('@serverless/utils/auth/login');
...
await login();
// User logged in successfully
```

### `logout`

Logout (clear stored refresh token). Returns `true` if there was a logged in user, `false` in case of no-op.

```javascript
const logout = require('@serverless/utils/auth/logout');
...
logout();
// No logged in user
```

### `resolveToken`

Resolve valid authentication token required for any exchange with Serverless Inc. API.
Once resolved, tokens are cached for instant resolution until they expire.

_Note: Resolved token should never be stored in outer logic. In all cases all calls to API should hit this utility directly to retrieve the id token._

Token is either an _id token_ resolved via _refresh token_ stored for logged-in CLI users or it's an _org token_ assumed from `SLS_ORG_TOKEN` environment variable where in CI/CD cases non expiring token is expected to be provided

```javascript
const resolveAuthToken = require('@serverless/utils/auth/resolve-token');
...
const responseData = await someServerlessIncApiCall.request({
  idToken: await resolveAuthToken()
});
```

### `resolveMode`

Confirm wether we're authenticated and with what kind of authentication (either as `users`, or as an `org`)

```javascript
const resolveAuthMode = require('@serverless/utils/auth/resolve-mode');
...
switch (await resolveAuthMode()) {
  case "user":
    console.log("We're authenticated as a logged-in user");
    break;
  case "org":
    console.log("We're authenticated with org token");
    break;
  default:
    console.log("We're not authenticated");
}
```
