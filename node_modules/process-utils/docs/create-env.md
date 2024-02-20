# `create-env([options])`

Creates `env` object. It's a plain object ensured to have only string property values

```javascript
const createEnv = require("process-utils/create-env");

const env = createEnv();
env.FOO = 12;

console.log(env.FOO); // "12"

spawn(program, args, { env }); // Use to invoke other processes in deterministic environment
```

## Supported options

### whitelist `iterable` (default: `[]`)

Provide a whitelist of env vars to expose on a copy

```javascript
process.env.FOO = "bar";
process.env.LOREM = "ipsum";
const env = createEnv({ whitelist: ["FOO"] });
// Exposes onlywhitelisted props
console.log(env.FOO); // "bar"
console.log(env.LOREM); // undefined
```

### asCopy `boolean` (default: `false`)

Override env as copy of original

```javascript
process.env.FOO = "bar";
const env = createEnv({ asCopy: true });
// Exposes process.env props
console.log(env.FOO); // "bar"
```

### veriables `object` (default: `null`)

Variables to be exposed on overriden `process.env`

```javascript
const env = createEnv({ variables: { ELO: 12 } });
// Exposes process.env props
console.log(process.env.FOO); // undefined
console.log(process.env.ELO); // "12"
```
