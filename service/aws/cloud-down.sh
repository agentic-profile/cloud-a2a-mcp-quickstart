#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

set -a
. cloud.env
set +a
: "${StackName:?Set StackName in cloud.env}"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

aws cloudformation delete-stack --stack-name \"${StackName}-${STAGE}\"
