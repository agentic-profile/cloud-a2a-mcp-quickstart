#!/bin/bash

# Agentic Profile MCP Lambda Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="agentic-profile-mcp"
ENVIRONMENT=${1:-dev}
REGION=${AWS_REGION:-us-east-1}

echo -e "${GREEN}🚀 Deploying Agentic Profile MCP Lambda Function${NC}"
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

# Build the project
echo -e "${YELLOW}📦 Building TypeScript project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Package the function
echo -e "${YELLOW}📦 Packaging function...${NC}"
npm run package

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Packaging failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Function packaged successfully${NC}"

# Deploy using CloudFormation
echo -e "${YELLOW}🚀 Deploying to AWS CloudFormation...${NC}"

aws cloudformation deploy \
    --template-file template.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides Environment=${ENVIRONMENT} \
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