## Utilities related to telemetry

```javascript
const telemetryUtils = require('@serverless/utils/telemetry');
```

Exposes following classes and methods:

### `StepHistory`

Helper class, used for recording step history for telemetry purposes in Interactive CLI flow. It extends `Map` class. In first iteration, it was intended to be used as direct map replacement that wraps value in an object with a timestamp. In second iteration, it exposes two methods - `start` and `finalize`, which in pair are used before and after presenting a question to a user, to record duration of the question. The `StepHistory` also offers `toJSON` method that formats map to JSON-serializable object, as well as `valuesMap`, that returns `Map` object that maps original keys to provided `value`.
