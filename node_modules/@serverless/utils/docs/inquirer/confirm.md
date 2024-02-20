# inquirer/confirm

Helper for configuring _confirm_ prompts:

Without helper:

```javascript
const shouldCreate = (
  await inquirer.prompt({
    message: 'Should we create project?',
    type: 'confirm',
    name: 'shouldCreate',
  })
).shouldCreate;
```

With helper:

```javascript
const confirm = require('@serverless/utils/inquirer/confirm');

const shouldCreate = await confirm('Should we create project?', {
  name: 'shouldCreate', // Optional, defaults to `isConfirmed"
});
```
