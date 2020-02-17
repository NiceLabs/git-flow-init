# @nice-labs/git-flow-init

![node version](https://img.shields.io/node/v/@nice-labs/git-flow-init)
[![npm module](https://img.shields.io/npm/v/@nice-labs/git-flow-init)](https://www.npmjs.com/package/@nice-labs/git-flow-init)

git-flow automate init on npm

## Usage

```bash
# on npm install
npm install @nice-labs/git-flow-init

# generate git-flow config backup file to project root directory
npx @nice-labs/git-flow-init backup

# restore git-flow config to the project
npx @nice-labs/git-flow-init restore
```

## `.gitflow-rc.json` Discovery range

1. Project root directory
2. Project first-level subdirectory
