#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

set -a
. ./cloud.env
set +a
: "${StackName:?Set StackName in aws/cloud.env}"

results_file="$HOME/.aws-stacks/${StackName}-${STAGE}.env"
if [ ! -f "$results_file" ]; then
  echo "Missing $results_file."
  echo "Run: npm run cloud:results:${STAGE}"
  exit 1
fi

set -a
. "$results_file"
set +a

: "${WebsiteBucketName:?Missing WebsiteBucketName in $(basename "$results_file")}"
: "${CloudFrontDistributionId:?Missing CloudFrontDistributionId in $(basename "$results_file")}"

echo "Building website (stage=$STAGE)..."
cd ..
pnpm install
pnpm build

echo "Deploying to S3 (bucket=$WebsiteBucketName)..."
aws s3 sync dist/ "s3://$WebsiteBucketName"

echo "Invalidating CloudFront (distribution=$CloudFrontDistributionId)..."
aws cloudfront create-invalidation --distribution-id "$CloudFrontDistributionId" --paths "/*"

echo "Deployed!"
