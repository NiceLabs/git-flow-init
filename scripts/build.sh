#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

rimraf dist
tsc
jq --slurp '.[0] + .[1]' package.json scripts/package.json |
	jq 'del(.devDependencies)' >dist/package.json
