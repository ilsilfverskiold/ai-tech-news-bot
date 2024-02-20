## Download

Functionality adapted from currently unmaintained `download` package: https://github.com/kevva/download

### Reasoning

The reason for "forking" this functionality was the bug caused by outdated `got` dependency in the latest (`8.0.0`) release of `download` packaged.
In our case, the problem was that timeout was not properly handled in case of `RequestError: getaddrinfo ENOTFOUND` being thrown (e.g. when user has issues with internet connection), which resulted in the process hanging for the duration of the timeout and ending with another error being thrown at the end of the timeout.

Related issue: https://github.com/kevva/download/issues/208

### Changes

The module is based on the source code from `v8.0.0` tag: https://github.com/kevva/download/blob/v8.0.0/index.js

In `utils` module, following changes were introduced:

- Upgrade of `got` library from `v8` to `v11`
- Move `rejectUnauthorized` to `https.rejectUnauthorized` option (required by `got` upgrade)
- Introduce `responseType: 'buffer'` option (required by `got` upgrade)
- Upgrade of `file-type` from `v11` to `v16`
- Use `FileType.fromBuffer` instead of `fileType` (required by `file-type` upgrade)
- Tests were rewritten to use `mocha` runner, but are heavily inspired by tests for the original module
- `download` API now accepts options supported by `got@11` instead of the ones supported by `got@8`
