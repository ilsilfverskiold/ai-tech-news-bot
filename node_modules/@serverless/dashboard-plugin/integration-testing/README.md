# Integration tests

Currently covers safegaurds implementation.

## Setup

- Must have an `integration` org & app.

## Running the tests locally

1. Ask a Serverless employee to be invited to the `integration` organization
2. Once added, create yourself an access key in the organization
3. Run the tests locally by running:

```
SERVERLESS_PLATFORM_STAGE=dev SERVERLESS_ACCESS_KEY=<your_key_here> npm run integration-test
```
