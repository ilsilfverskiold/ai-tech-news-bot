## `getNotificationsMode()`

```javascript
const getNotificationsMode = require('@serverless/utils/telemetry');
```

Resolves notification mode based on `SLS_NOTIFICATION_MODE` environment variable setting. When that setting is not available, it returns `NOTIFICATIONS_MODE_ON` or `NOTIFICATIONS_MODE_ONLY_OUTDATED_VERSION` in cases where function is executed in context of CI environment as identified by `ci-info` library.
