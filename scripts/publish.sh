#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

cd dist || exit 1

npm publish
