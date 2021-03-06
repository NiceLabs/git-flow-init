#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cp .npmrc dist
cp README.md dist
cd dist || exit 1

jq '.name = "@nicelabs/git-flow-init"' package.json > package-modified.json
mv package-modified.json package.json

VERSION=$(jq -r '.version' package.json)
npm --no-git-tag-version version "$VERSION-$BUILD_VERSION"
npm publish
