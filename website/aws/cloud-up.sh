#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

set -a
. cloud.env
set +a
: "${StackName:?Set StackName in cloud.env}"
: "${CertificateArn:?Set CertificateArn in cloud.env}"
: "${ProdDomainName:=}"
: "${StagingDomainName:=}"
: "${Route53HostedZoneId:=}"
: "${NakedDomainName:=}"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

aws cloudformation deploy \
  --template-file ./cloud-formation.yaml \
  --stack-name "${StackName}-${STAGE}" \
  --parameter-overrides \
    StackName="${StackName}" \
    Stage="${STAGE}" \
    CertificateArn="${CertificateArn}" \
    ProdDomainName="${ProdDomainName}" \
    StagingDomainName="${StagingDomainName}" \
    NakedDomainName="${NakedDomainName}" \
    Route53HostedZoneId="${Route53HostedZoneId}" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --region us-west-2

node write-formation-results.js --stage=${STAGE}
