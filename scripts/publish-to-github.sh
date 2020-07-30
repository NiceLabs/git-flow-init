#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cp .npmrc dist/.npmrc
cd dist || exit 1

jq '.name = "@nicelabs/git-flow-init"' package.json > package-modified.json
mv package-modified.json package.json

VERSION=$(jq -r '.version' package.json)
npm --no-git-tag-version version "$VERSION-$GITHUB_RUN_NUMBER"
npm publish
