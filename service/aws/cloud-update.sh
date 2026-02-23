#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

set -a
. ~/.aws-stacks/foundation-results.env
unset StackName
. cloud.env
set +a
: "${StackName:?Set StackName in cloud.env}"
: "${DeploymentBucketName:?DeploymentBucketName must be set in foundation-results.env}"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

FUNCTION_NAME="${StackName}-${STAGE}"
S3_KEY="${StackName}-${STAGE}/function.zip"

echo "Building function.zip..."
./zip-function.sh

echo "Uploading to s3://${DeploymentBucketName}/${S3_KEY}"
aws s3 cp function.zip "s3://${DeploymentBucketName}/${S3_KEY}"

echo "Updating Lambda ${FUNCTION_NAME}..."
aws lambda update-function-code \
  --function-name "${FUNCTION_NAME}" \
  --s3-bucket "${DeploymentBucketName}" \
  --s3-key "${S3_KEY}"

echo "Done. Lambda is updating (allow a few seconds before it serves new code)."
