## Serverless Inc. API request

### `apiRequest(pathname[, { method, body }])`

Issue a request to Serverless Inc. API.

```javascript
const apiRequest = require('@serverless/utils/api-request');

const { orgId: myOrgId } = await apiRequest('/orgs/name/my-org-name');
```

#### Supported options

##### `method`

Request method

##### `body`

Body for request (only plain object is accepted)
