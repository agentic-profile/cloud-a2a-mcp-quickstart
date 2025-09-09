#!/bin/bash

cd "$(dirname "$0")"

# Universal Auth A2A MCP Lambda Deployment Script for AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}📄 Loading environment variables from .env file...${NC}"
    export $(grep -v '^#' .env | xargs)
    echo -e "${GREEN}✅ Environment variables loaded from .env${NC}"
fi

# Configuration
ENVIRONMENT=${1}
PROJECT=${2}
STACK_NAME="agentic-service-a2a-mcp-${PROJECT}-${ENVIRONMENT}"

# Validate required parameters
if [ -z "${PROJECT}" ]; then
    echo -e "${RED}❌ Error: PROJECT is required. Please provide a project name as the second argument.${NC}"
    echo -e "${YELLOW}Usage: $0 <environment> <project>${NC}"
    echo -e "${YELLOW}Example: $0 staging myproject${NC}"
    exit 1
fi

if [ "${ENVIRONMENT}" != "staging" ] && [ "${ENVIRONMENT}" != "prod" ]; then
    echo -e "${RED}❌ Error: ENVIRONMENT must be either 'staging' or 'prod'. Got: '${ENVIRONMENT}'${NC}"
    echo -e "${YELLOW}Usage: $0 <environment> <project>${NC}"
    echo -e "${YELLOW}Example: $0 staging myproject${NC}"
    exit 1
fi

# Set domain name based on environment (only if DOMAIN_NAME is already defined)
if [ -n "${DOMAIN_NAME}" ]; then
    if [ "${ENVIRONMENT}" = "staging" ]; then
        DOMAIN_NAME="${PROJECT}-api-staging.${DOMAIN_NAME}"
    elif [ "${ENVIRONMENT}" = "prod" ]; then
        DOMAIN_NAME="${PROJECT}-api.${DOMAIN_NAME}"
    fi
fi

# Get region from AWS CLI configuration, fallback to environment variable, then default
REGION=$(aws configure get region 2>/dev/null || echo ${AWS_REGION:-us-east-1})

echo -e "${GREEN}🚀 Deploying Universal Auth A2A and MCP Lambda Function${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Project: ${PROJECT}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Stack Name: ${STACK_NAME}${NC}"
echo -e "${YELLOW}Certificate ARN: ${CERTIFICATE_ARN}${NC}"
echo -e "${YELLOW}Domain Name: ${DOMAIN_NAME}${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials are not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI and credentials verified${NC}"

# Build the function.zip
echo -e "${YELLOW}📦 Creating function.zip...${NC}"
npm run service:package
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Generating function.zip failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Package completed successfully${NC}"

# Verify function.zip was created
echo -e "${YELLOW}📦 Verifying function.zip...${NC}"
if [ ! -f "function.zip" ]; then
    echo -e "${RED}❌ function.zip not found after packaging${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Function package verified${NC}"

# Check if foundation stack exists
FOUNDATION_STACK_NAME="agentic-foundation-${ENVIRONMENT}"
echo -e "${YELLOW}🔍 Checking for foundation stack: ${FOUNDATION_STACK_NAME}${NC}"

if ! aws cloudformation describe-stacks --stack-name ${FOUNDATION_STACK_NAME} --region ${REGION} &> /dev/null; then
    echo -e "${RED}❌ Foundation stack not found. Please run 'npm run foundation:up' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Foundation stack found${NC}"

# Get the S3 bucket name from foundation stack
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name ${FOUNDATION_STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`DeploymentBucketName`].OutputValue' \
    --output text)

if [ -z "${BUCKET_NAME}" ]; then
    echo -e "${RED}❌ Could not get S3 bucket name from foundation stack${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Using S3 bucket from foundation: ${BUCKET_NAME}${NC}"

# Upload function.zip to S3 first
echo -e "${YELLOW}📦 Uploading function.zip to S3 bucket: ${BUCKET_NAME}${NC}"

# Upload the zip file to S3 with project scoping
aws s3 cp function.zip s3://${BUCKET_NAME}/${PROJECT}/function.zip

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to upload function.zip to S3${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Function uploaded to S3 successfully${NC}"

# Get the version ID of the uploaded file
echo -e "${YELLOW}📋 Getting S3 object version...${NC}"
VERSION_ID=$(aws s3api head-object \
    --bucket ${BUCKET_NAME} \
    --key ${PROJECT}/function.zip \
    --query 'VersionId' \
    --output text)

echo -e "${YELLOW}📦 S3 object version: ${VERSION_ID}${NC}"

# Deploy using CloudFormation with the uploaded function.zip
echo -e "${YELLOW}🚀 Deploying to AWS CloudFormation...${NC}"

# Build parameter overrides
PARAMETER_OVERRIDES="Environment=${ENVIRONMENT} Project=${PROJECT} FoundationDeploymentBucket=${BUCKET_NAME} FunctionZipVersion=${VERSION_ID}"

# Add domain parameters if provided
if [ -n "${DOMAIN_NAME}" ]; then
    PARAMETER_OVERRIDES="${PARAMETER_OVERRIDES} DomainName=${DOMAIN_NAME}"
fi

if [ -n "${CERTIFICATE_ARN}" ]; then
    PARAMETER_OVERRIDES="${PARAMETER_OVERRIDES} CertificateArn=${CERTIFICATE_ARN}"
fi

# Deploy the stack with foundation bucket parameter and function version
aws cloudformation deploy \
    --template-file agentic-service.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides ${PARAMETER_OVERRIDES} \
    --region ${REGION}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get the API Gateway URL
echo -e "${YELLOW}📋 Getting deployment outputs...${NC}"

# Try to get custom domain URL first, fallback to default API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`CustomDomainUrl`].OutputValue' \
    --output text)

if [ -z "${API_URL}" ]; then
    API_URL=$(aws cloudformation describe-stacks \
        --stack-name ${STACK_NAME} \
        --region ${REGION} \
        --query 'Stacks[0].Outputs[?OutputKey==`HttpApiUrl`].OutputValue' \
        --output text)
fi

FUNCTION_NAME=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunctionName`].OutputValue' \
    --output text)

echo ""
echo -e "${GREEN}🎉 Deployment Summary:${NC}"
echo -e "${YELLOW}API Gateway URL: ${API_URL}${NC}"
echo -e "${YELLOW}Lambda Function: ${FUNCTION_NAME}${NC}"
echo ""
echo -e "${GREEN}📝 Test your deployment:${NC}"
echo -e "${YELLOW}Health Check:${NC} curl ${API_URL}"
echo -e "${YELLOW}MCP Initialize:${NC} curl -X POST ${API_URL} -H 'Content-Type: application/json' -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\"}'"
echo ""
echo -e "${GREEN}📊 Monitor your function:${NC}"
echo -e "${YELLOW}CloudWatch Logs:${NC} aws logs tail /aws/lambda/${FUNCTION_NAME} --follow"
echo -e "${YELLOW}CloudFormation Console:${NC} https://console.aws.amazon.com/cloudformation/home?region=${REGION}#/stacks/stackinfo?stackId=${STACK_NAME}" 