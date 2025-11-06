#!/bin/bash

# Package Lambda function with optimized size
# This script creates a production-ready package with only necessary files

set -e

cd "$(dirname "$0")"
AWS_DIR="$(pwd)"

SERVICE_DIR="../service"
PACKAGE_DIR=$(mktemp -d)
ZIP_FILE="function.zip"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Packaging Lambda function...${NC}"

# Clean up any existing zip
rm -f "${AWS_DIR}/${ZIP_FILE}"

# Create package directory structure
mkdir -p "${PACKAGE_DIR}"

# Copy necessary files
echo -e "${YELLOW}📋 Copying files...${NC}"
cp -r "${SERVICE_DIR}/dist" "${PACKAGE_DIR}/"
cp -r "${SERVICE_DIR}/www" "${PACKAGE_DIR}/"
cp "${SERVICE_DIR}/package.json" "${PACKAGE_DIR}/"
if [ -f "${SERVICE_DIR}/keyring.json" ]; then
  cp "${SERVICE_DIR}/keyring.json" "${PACKAGE_DIR}/"
fi

# Install only production dependencies
echo -e "${YELLOW}📥 Installing production dependencies...${NC}"
cd "${PACKAGE_DIR}"
# Use npm for production install (works with any package.json)
npm install --production --no-audit --no-fund --loglevel=error --legacy-peer-deps

# Remove unnecessary files from node_modules to reduce size
echo -e "${YELLOW}🧹 Cleaning up node_modules...${NC}"
find node_modules -type f \( \
  -name "*.md" -o \
  -name "*.txt" -o \
  -name "*.map" -o \
  -name "CHANGELOG*" -o \
  -name "LICENSE*" -o \
  -name "LICENCE*" -o \
  -name "README*" -o \
  -name "HISTORY*" -o \
  -name "CONTRIBUTING*" -o \
  -name "AUTHORS*" -o \
  -name "TODO*" -o \
  -name "tsconfig.json" -o \
  -name "tsconfig.*.json" -o \
  -name ".eslintrc*" -o \
  -name "eslint.config.*" -o \
  -name ".prettierrc*" -o \
  -name ".npmignore" \
\) -delete

# Remove unnecessary directories
find node_modules -type d \( \
  -name "test" -o \
  -name "tests" -o \
  -name "__tests__" -o \
  -name "examples" -o \
  -name "example" -o \
  -name "docs" -o \
  -name "doc" -o \
  -name ".github" -o \
  -name ".git" -o \
  -name "coverage" -o \
  -name ".nyc_output" -o \
  -name ".yarn" -o \
  -name ".cache" \
\) -exec rm -rf {} + 2>/dev/null || true

# Remove test files
find node_modules -type f \( \
  -name "*.test.js" -o \
  -name "*.test.ts" -o \
  -name "*.test.mjs" -o \
  -name "*.spec.js" -o \
  -name "*.spec.ts" -o \
  -name "*.spec.mjs" \
\) -delete

# Create zip file
echo -e "${YELLOW}📦 Creating zip archive...${NC}"
cd "${PACKAGE_DIR}"
zip -r "${AWS_DIR}/${ZIP_FILE}" . -q

# Get file size
ZIP_SIZE=$(du -h "${AWS_DIR}/${ZIP_FILE}" | cut -f1)
echo -e "${GREEN}✅ Package created: ${AWS_DIR}/${ZIP_FILE} (${ZIP_SIZE})${NC}"

# Clean up temporary directory
rm -rf "${PACKAGE_DIR}"

echo -e "${GREEN}✅ Packaging complete!${NC}"

