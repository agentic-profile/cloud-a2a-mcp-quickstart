#!/bin/bash

cd "$(dirname "$0")"

# Universal Auth A2A MCP Lambda Deployment Script for AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1}
STACK_NAME="universal-auth-a2a-mcp-${ENVIRONMENT}"

# Get region from AWS CLI configuration, fallback to environment variable, then default
REGION=$(aws configure get region 2>/dev/null || echo ${AWS_REGION:-us-east-1})

echo -e "${GREEN}🚀 Deploying Universal Auth A2A and MCP Lambda Function${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Region: ${REGION}${NC}"
echo -e "${YELLOW}Stack Name: ${STACK_NAME}${NC}"
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
npm run "package:${ENVIRONMENT}"
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

# Upload the zip file to S3
aws s3 cp function.zip s3://${BUCKET_NAME}/function.zip

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to upload function.zip to S3${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Function uploaded to S3 successfully${NC}"

# Get the version ID of the uploaded file
echo -e "${YELLOW}📋 Getting S3 object version...${NC}"
VERSION_ID=$(aws s3api head-object \
    --bucket ${BUCKET_NAME} \
    --key function.zip \
    --query 'VersionId' \
    --output text)

echo -e "${YELLOW}📦 S3 object version: ${VERSION_ID}${NC}"

# Deploy using CloudFormation with the uploaded function.zip
echo -e "${YELLOW}🚀 Deploying to AWS CloudFormation...${NC}"

# Deploy the stack with foundation bucket parameter and function version
aws cloudformation deploy \
    --template-file agentic-service.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides Environment=${ENVIRONMENT} FoundationDeploymentBucket=${BUCKET_NAME} FunctionZipVersion=${VERSION_ID} \
    --region ${REGION}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Get the API Gateway URL
echo -e "${YELLOW}📋 Getting deployment outputs...${NC}"

API_URL=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
    --output text)

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