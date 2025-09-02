#!/bin/bash

cd "$(dirname "$0")"

# Agentic Website Deployment Script for AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1}
PROJECT=${2:-demo}  # Default to 'demo' if not provided
STACK_NAME="agentic-website-${PROJECT}-${ENVIRONMENT}"

# Get region from AWS CLI configuration, fallback to environment variable, then default
REGION=$(aws configure get region 2>/dev/null || echo ${AWS_REGION:-us-east-1})

echo -e "${GREEN}🚀 Deploying Agentic Website${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Project: ${PROJECT}${NC}"
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

# Build the website
echo -e "${YELLOW}📦 Building website...${NC}"
npm run website:build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Website build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Website build completed successfully${NC}"

# Verify build artifacts exist
echo -e "${YELLOW}📦 Verifying build artifacts...${NC}"
if [ ! -d "../website/dist" ]; then
    echo -e "${RED}❌ Website build artifacts not found in ../website/dist${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build artifacts verified${NC}"

# Deploy the CloudFormation stack
echo -e "${YELLOW}🚀 Deploying website infrastructure to AWS CloudFormation...${NC}"

# Deploy the stack
aws cloudformation deploy \
    --template-file agentic-website.yaml \
    --stack-name ${STACK_NAME} \
    --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
    --parameter-overrides Environment=${ENVIRONMENT} Project=${PROJECT} \
    --region ${REGION}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Website infrastructure deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Website infrastructure deployed successfully!${NC}"

# Get the website bucket name from the stack
echo -e "${YELLOW}📋 Getting website bucket information...${NC}"

WEBSITE_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
    --output text)

if [ -z "${WEBSITE_BUCKET}" ]; then
    echo -e "${RED}❌ Could not get website bucket name from CloudFormation stack${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Website bucket: ${WEBSITE_BUCKET}${NC}"

# Upload website assets to S3
echo -e "${YELLOW}📦 Uploading website assets to S3 bucket: ${WEBSITE_BUCKET}${NC}"

# Sync the built website assets to S3
aws s3 sync ../website/dist s3://${WEBSITE_BUCKET} \
    --delete \
    --cache-control "max-age=31536000,public" \
    --region ${REGION}

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to upload website assets to S3${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Website assets uploaded to S3 successfully${NC}"

# Get the CloudFront Distribution ID for cache invalidation
echo -e "${YELLOW}📋 Getting CloudFront Distribution ID for cache invalidation...${NC}"

CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

if [ -z "${CLOUDFRONT_DISTRIBUTION_ID}" ]; then
    echo -e "${RED}❌ Could not get CloudFront Distribution ID from CloudFormation stack${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 CloudFront Distribution ID: ${CLOUDFRONT_DISTRIBUTION_ID}${NC}"

# Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"

INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create CloudFront cache invalidation${NC}"
    exit 1
fi

echo -e "${GREEN}✅ CloudFront cache invalidation created successfully${NC}"
echo -e "${YELLOW}🔄 Invalidation ID: ${INVALIDATION_ID}${NC}"
echo -e "${YELLOW}⏳ Note: Cache invalidation may take 10-15 minutes to complete${NC}"

# Get the website URL
echo -e "${YELLOW}📋 Getting website information...${NC}"

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name ${STACK_NAME} \
    --region ${REGION} \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteUrl`].OutputValue' \
    --output text)

echo ""
echo -e "${GREEN}🎉 Website Deployment Summary:${NC}"
echo -e "${YELLOW}Website URL: ${WEBSITE_URL}${NC}"
echo -e "${YELLOW}S3 Bucket: ${WEBSITE_BUCKET}${NC}"
echo -e "${YELLOW}CloudFront Distribution ID: ${CLOUDFRONT_DISTRIBUTION_ID}${NC}"
echo -e "${YELLOW}Cache Invalidation ID: ${INVALIDATION_ID}${NC}"
echo ""
echo -e "${GREEN}📝 Test your website:${NC}"
echo -e "${YELLOW}Open in browser:${NC} ${WEBSITE_URL}"
echo -e "${YELLOW}⏳ Note: If changes don't appear immediately, wait for cache invalidation to complete (10-15 minutes)${NC}"
echo ""
echo -e "${GREEN}📊 Monitor your website:${NC}"
echo -e "${YELLOW}CloudFront Console:${NC} https://console.aws.amazon.com/cloudfront/home?region=${REGION}#/distributions/${CLOUDFRONT_DISTRIBUTION_ID}"
echo -e "${YELLOW}S3 Console:${NC} https://console.aws.amazon.com/s3/buckets/${WEBSITE_BUCKET}"
echo -e "${YELLOW}CloudFormation Console:${NC} https://console.aws.amazon.com/cloudformation/home?region=${REGION}#/stacks/stackinfo?stackId=${STACK_NAME}"
