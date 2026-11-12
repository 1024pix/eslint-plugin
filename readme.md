# @1024pix/eslint-plugin

[![npm](https://img.shields.io/npm/v/@1024pix/eslint-plugin)](https://npmjs.com/package/@1024pix/eslint-plugin)

## Usage

### Install

```bash
npm install --save-dev eslint@^9 @1024pix/eslint-plugin
```

### Config `eslint.config.cjs`

```cjs
const pixEslintConfig = require('@1024pix/eslint-plugin/config');

module.exports = pixEslintConfig;
```

Note that this ESLint config is not ready to use with ESM.

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Config VS Code auto fix

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and create `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": false
  }
}
```

## Optional rules

These rules are shipped by the plugin but not enabled by the shared config.

### `@1024pix/no-linear-lookup-in-loop`

Reports an equality lookup (`find`, `filter`, `findIndex`, `some`, `every`…) nested in a loop when it compares against a variable of that loop. Such a join costs O(n × m).

```js
// ✗ one scan of `rows` per id
ids.map((id) => rows.find((row) => row.id === id));

// ✓ one pass to index, then one read per id
const rowsById = new Map(rows.map((row) => [row.id, row]));
ids.map((id) => rowsById.get(id));
```

Enable it where both collections grow with the data, for example:

```js
{
  files: ['src/**/repositories/**/*.js', 'src/**/usecases/**/*.js'],
  rules: { '@1024pix/no-linear-lookup-in-loop': 'error' },
}
```

## FAQ

### I prefer XXX...

Sure, you can override the rules in your `eslint.config.js` file.

```cjs
const pixEslintConfig = require('@1024pix/eslint-plugin/config');

module.exports = [
  ...pixEslintConfig,
  {
    rules: {
      // your rules...
    },
  },
];
```

Or you can always fork this repo and make your own.

## Migration guide

### v1.2.0

Before v1.2.0, Pix Config was provided by the [@1024pix/eslint-config](https://github.com/1024pix/eslint-config) project.

After upgrading, you should migrate from the old `.eslintrc` files to the new `eslint.config.cjs` file format.

Take a look at the [official ESLint migration guide](https://eslint.org/docs/latest/use/configure/migration-guide). You can also take inspiration from [this Pix context example](https://github.com/1024pix/pix/pull/8995).

Once finished, `@1024pix/eslint-config` can safely be removed.
