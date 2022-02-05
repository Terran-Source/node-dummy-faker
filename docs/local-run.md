## How to run a local example after cloning this repo

```bash
$ npx cross-env TS_NODE_COMPILER_OPTIONS='{"allowJs": false,"checkJs": false}' node -r ts-node/register examples/example.ts
$ npx cross-env TS_NODE_COMPILER_OPTIONS='{"allowJs": false,"checkJs": false}' node -r ts-node/register examples/example.js
$ npx cross-env TS_NODE_COMPILER_OPTIONS='{"allowJs": false,"checkJs": false}' node -r ts-node/register examples/example-3rd-party.ts
$ npx cross-env TS_NODE_COMPILER_OPTIONS='{"allowJs": false,"checkJs": false}' node -r ts-node/register examples/example-3rd-party.js
$ npx cross-env TS_NODE_COMPILER_OPTIONS='{"allowJs": false,"checkJs": false}' node -r ts-node/register examples/example-stream.ts
$ npx cross-env TS_NODE_COMPILER_OPTIONS='{"allowJs": false,"checkJs": false}' node -r ts-node/register examples/example-stream.js
```

Maybe we can add VsCode tasks for that 🧐.
