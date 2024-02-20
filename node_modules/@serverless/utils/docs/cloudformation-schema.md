# cloudformationSchema

## Utilities for js-yaml library use with AWS cloudformation specific YAML types

YAML schema including AWS Cloudformation specific short-hand syntaxes (i.e. `!Ref` or `!GetAtt`).
It can then be passed as option to `js-yaml` library `load` method:

```javascript
const yaml = require('js-yaml');
const fs   = require('fs');
const cloudFormationSchema = require('@serverless/utils/cloudformation-schema');

yaml.load(fs.readFileSync('serverless.yml', { schema: cloudFormationSchema });
```
