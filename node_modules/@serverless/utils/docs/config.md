# config

## Handler of user config files (stored in `.serverlessrc`)

By default, global config is stored in home directory, but user can also store it in `~/.config`. In addition, local config is recognized if it's present in current directory. On resolution, values from both global and local configs will be merged, with local config values overriding global ones.

When using `delete` or `set`, only one underlying config file will be modified. If local config file is present, it will be modified. Otherwise, global config will be modified.

Ensures no exception on eventual access issues (altough errors are logged with `SLS_DEBUG` env var on). If malformed config will be encountered, it will be renamed to `.serverlessrc.bak` and in case of global configuration, it will be recreated with default values under `~/.serverlessrc`. If local config is malformed, it won't be recreated.

```javascript
const config = require('@serverless/utils/config');
```

Exposes following _sync_ access methods:

### `get(propertyPath)`

Retrieve stored property. It supports nested paths as well.

### `set(propertyPath, value)`

Store given property (can be any JSON value).

### `set(object)`

Merge provided `object` with existing config.

### `delete(propertyPath)`

Delete given property. It supports nested paths as well.

### `delete(arrayOfPropertyPaths)`

Delete all properties in provided `arrayOfPropertyPaths`. It supports nested paths as well.

### `getConfig()`

Returns whole config structure (merged if both local and global configs found)

### `getLoggedInUser()`

Returns details about currently logged in user (based on `userId` value in config).

Example result:

```javascript
{
  idToken: 'user-id-token',
  accessKeys: ['first-access-key', 'second-access-key'],
  username: 'exampleUser',
  userId: 'example-user-id',
}
```
