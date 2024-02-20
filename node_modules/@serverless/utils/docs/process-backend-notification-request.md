# processBackendNotificationRequest

Out of all applicable notifications as returned by backend. Resolves one that applies mostly to user at given moment.

Logic depends purely on history of previously shown notifications.

```javascript
const processBackendNotificationRequest = require('@serverless/utils/process-backend-notification-request');

const notification = processBackendNotificationRequest(notifiations);

if (notification) printNotifiation(notifications);
```

## Notifications mode

Notifications presentation mode can be tweaked depending on given environment needs.

Check [Telemetry and notifications](https://www.serverless.com/framework/docs/telemetry#adjustingdisabling-notifications) documentation for details
