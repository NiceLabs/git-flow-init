# @nice-labs/git-flow-init

git-flow automate init on npm

## Usage

```bash
# on npm install
npm set @nice-labs:registry https://npm.septs.me
npm install @nice-labs/git-flow-init

# generate git-flow config backup file to project root directory
npx @nice-labs/git-flow-init backup

# restore git-flow config to the project
npx @nice-labs/git-flow-init restore
```

## `.gitflow-rc.json` Discovery range

1. Project root directory
2. Project first-level subdirectory
