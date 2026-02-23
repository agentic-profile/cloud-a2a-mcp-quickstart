#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

for arg in "$@"; do
  if [[ "$arg" == --stage=* ]]; then
    STAGE="${arg#--stage=}"
  fi
done
: "${STAGE:?Pass --stage=staging or --stage=prod to the script}"

set -a
. ~/.aws-stacks/foundation-results.env
unset StackName
. cloud.env
set +a
: "${StackName:?Set StackName in cloud.env}"

# Copy function.zip to deployment bucket
./zip-function.sh
aws s3 cp function.zip "s3://${DeploymentBucketName}/${StackName}-${STAGE}/function.zip"

aws cloudformation deploy \
  --template-file cloud-formation.yaml \
  --stack-name "${StackName}-${STAGE}" \
  --parameter-overrides \
    StackName="${StackName}" \
    Stage="${STAGE}" \
    DeploymentBucketName="${DeploymentBucketName}" \
    FoundationVpcId="${FoundationVpcId}" \
    PrivateSubnet1Id="${PrivateSubnet1Id}" \
    PrivateSubnet2Id="${PrivateSubnet2Id}" \
    ValkeyClientUserName="${ValkeyClientUserName}" \
    ValkeyClientPasswordSecretArn="${ValkeyClientPasswordSecretArn}" \
    ValkeyEndpoint="${ValkeyEndpoint}" \
    ValkeyPort="${ValkeyPort}" \
    ValkeyClientSecurityGroupId="${ValkeyClientSecurityGroupId}" \
    CustomDomainMode="${CustomDomainMode:-none}" \
    ProdDomainName="${ProdDomainName}" \
    StagingDomainName="${StagingDomainName}" \
    CertificateArn="${CertificateArn}" \
    Route53HostedZoneId="${Route53HostedZoneId:-}" \
    NodeEnv="${NodeEnv:-production}" \
    LogLevel="${LogLevel:-info}" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM

node write-formation-results.js --stage=${STAGE}
