## Utilities related to serverless console UI

Serverless Console UI utilities that are commonly used across multiple interfaces such as the CLI, Web, and more.

```javascript
const uiUtils = require('@serverless/utils/console-ui');
```

Exposes following methods:

### `getSpanDuration(startTime, endTime)`

This function returns the difference in milliseconds between two ISO strings

### `formatAWSSDKName(activity)`

This function takes in a console span, specifically an aws sdk span, and returns a formatted name

### `formatHTTPName(activity)`

This function takes in an http span object and returns a formatted name

### `formatConsoleEvent(data)`

This function takes in a console event object and returns a formatted event object

### `formatConsoleSpan(data)`

This function takes in a span object and returns the same span with a duration, durationFormatted, and niceName attribute

### `formatConsoleDate(date)`

This function takes in a date object and returns a formatted date of HH:mm:ss:SSS

### `omitAndSortDevModeActivity(array)`

This function will filter out broken and irrelevant data from the serverless console dev mode activity stream
