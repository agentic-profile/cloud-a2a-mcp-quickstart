#!/bin/bash

cd "$(dirname "$0")"
cd ..

echo "Building distribution..."
pnpm install
pnpm build

echo "Cleaning up mode_modules - removing non-production ones..."
rm -rf node_modules
pnpm install --prod --node-linker=hoisted

echo "Creating upload zipfile..."
rm -f aws/function.zip
zip -r aws/function.zip \
    package.json \
    google-keys.json \
    keyring.json \
    dist/* \
    www/* \
    www/.well-known/* \
    node_modules \
    -x '*@aws-sdk*'

#echo "Deploying to Lambda..."
#aws lambda update-function-code --function-name matchwise-node-agents --zip-file fileb://function.zip --profile mobido

echo "Done!"