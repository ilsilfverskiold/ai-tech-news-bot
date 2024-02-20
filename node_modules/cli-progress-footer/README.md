[![Build status][build-image]][build-url]
[![Tests coverage][cov-image]][cov-url]
[![npm version][npm-image]][npm-url]

# cli-progress-footer

## Manage dynamic progress content below std output stream

Content agnostic. For reliable output all of process std output needs go through this utility. To ensure that by default `process.stdout.write` is overriden and `process.stderr` is redirected into `process.stdout` (with possibility to opt out from both).

### Installation

```sh
npm install cli-progress-footer
```

### Usage

```javascript
const cliProgressFooter = require("cli-progress-footer")();

// Write progress
cliProgresssFooter.updateProgress("# processing 1\n# processing 2\n# processing 3\n");
...
// Update progress content when necessary
cliProgresssFooter.updateProgress("# processing 2\n# processing 3\n# processing 4\n");
...
// Update progress content when necessary
cliProgresssFooter.updateProgress("# processing 3\n# processing 4\n");
```

By default both `stdout` and `stderr` output is automatically handled and ensured to appear above progress content

### Options

##### overrideStdout `bool` _(default: `true`)_

Whether to override data written to `process.stdout` stream so it appears in all cases above progress bar.
Modified writes are passed immediately to native `process.stdout.write` so there's no risk of losing some log content or seing it out of sync

You may opt out but then if any content is written to `process.stdout`, process output may appear as not reliable.

When opting out you may write regular log content via `cliProgressFooter.writeStdout(data)`

##### redirectStderr `bool` _(default: `true`)_

When progress footer is in play, all output should be treated as one `std` stream. If it's not the case then
any `stderr` output may break visible log output. Therefore by default all `stderr` content is redirected to `stdout`.

If you wish to redirect `stderr` somewhere else with cli means, then it's best turn this function off (so `proces.stderr.write` is not overriden)

##### discardStdin `bool` _(default: `true`)_

Whether to mute stdin input (so it doesn't add to displayed progress output). In scope of that setting also cursor is hidden

##### workaroundChildProcess `bool` _(default: `true`)_

Whether to hide a progress bar for a time being of child process runs with inherited `stdio`.

Problem is that output of such processes cannot be controlled, and if happens will break the progress bar output.

Internal workaround is to decorate `child_process` module functions, and react accordingly whenever problematic child process is created

#### Throbber animation

Additionally each progress line may be automatically prefixed with throbber (frames customizable at `cliProgresssFooter.progressAnimationPrefixFrames`), for that apply following setting:

```javascript
cliProgressFooter.shouldAddProgressAnimationPrefix = true;
```

### Tests

```sh
npm test
```

[build-image]: https://github.com/medikoo/cli-progress-footer/workflows/Integrate/badge.svg
[build-url]: https://github.com/medikoo/cli-progress-footer/actions?query=workflow%3AIntegrate
[cov-image]: https://img.shields.io/codecov/c/github/medikoo/cli-progress-footer.svg
[cov-url]: https://codecov.io/gh/medikoo/cli-progress-footer
[npm-image]: https://img.shields.io/npm/v/cli-progress-footer.svg
[npm-url]: https://www.npmjs.com/package/cli-progress-footer
