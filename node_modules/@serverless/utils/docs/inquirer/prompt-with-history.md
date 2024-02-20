# inquirer/prompt-with-history

Helper that will configure prompts and record the answer in history. In addition to regular `inquirer.prompt` properties it also supports `stepHistory`, which is expected to be an instance of `inquirer/telemetry/StepHistory`, as well as `recordRawAnswerInHistory`, which can be used to force recording unanonymized answer in `stepHistory`. By default, user input will be anonymized unless it is not specific to that user. Wrapper has been introduced for the purposes of enhancing telemetry for Onboarding CLI.

Usage:

```
const answer = await promptWithHistory({ stepHistory = new StepHistory(), name: 'someQuestion', message: 'Should we do it?', type: 'confirm'});
```
