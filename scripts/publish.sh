#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

npm start

cp README.md dist
cd dist || exit 1

npm publish
