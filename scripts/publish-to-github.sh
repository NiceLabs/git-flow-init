#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd dist || exit 1

npm config list

jq '.name = "@nicelabs/git-flow-init"' package.json > package-modified.json
mv package-modified.json package.json

VERSION=$(jq -r '.version' package.json)
npm --no-git-tag-version version "$VERSION-$GITHUB_RUN_NUMBER"
npm publish
