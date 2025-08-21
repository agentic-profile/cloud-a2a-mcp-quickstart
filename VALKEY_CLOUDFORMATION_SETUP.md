# Valkey CloudFormation Integration

This document explains how the Valkey cache is configured to work with CloudFormation infrastructure.

## Overview

The Valkey cache is configured to automatically retrieve its connection details from CloudFormation outputs and AWS Secrets Manager. This provides a secure and scalable way to manage cache configuration across different environments.

## CloudFormation Setup

### Foundation Stack (`foundation.yaml`)

The foundation stack creates:

1. **Valkey Serverless Cache**: A Redis-compatible serverless cache using AWS ElastiCache
2. **Secrets Manager Secret**: Stores the Valkey password securely
3. **VPC and Networking**: Required infrastructure for the cache
4. **Security Groups**: Controls access to the cache

### Service Stack (`mcp-service.yaml`)

The service stack:

1. **Imports Foundation Outputs**: Gets the cache endpoint, port, and password secret ARN
2. **Sets Environment Variables**: Passes configuration to the Lambda function
3. **Grants IAM Permissions**: Allows Lambda to access Secrets Manager

## Environment Variables

The Lambda function receives these environment variables from CloudFormation:

- `VALKEY_ENDPOINT`: The cache endpoint (e.g., `agentic-foundation-valkey-dev.xxxxx.cache.amazonaws.com`)
- `VALKEY_PORT`: The cache port (typically `6379`)
- `VALKEY_PASSWORD_SECRET_ARN`: ARN of the Secrets Manager secret containing the password

## Code Integration

The `valkey.ts` file automatically:

1. **Constructs Connection URL**: Combines endpoint and port from environment variables
2. **Retrieves Password**: Fetches password from Secrets Manager using the provided ARN
3. **Caches Password**: Stores the password in memory to avoid repeated API calls
4. **Handles Errors**: Gracefully handles missing configuration or connection issues

## Usage Example

```typescript
import { storeValue, getValue, healthCheck } from './cache/valkey';

// Store a value
await storeValue('user:123', { name: 'John', email: 'john@example.com' }, 3600);

// Retrieve a value
const user = await getValue('user:123');

// Check connection health
const isHealthy = await healthCheck();
```

## Deployment

1. **Deploy Foundation**: `npm run foundation:up`
2. **Deploy Service**: `npm run deploy`

The foundation stack must be deployed first as the service stack depends on its outputs.

## Security

- Passwords are stored in AWS Secrets Manager with automatic rotation
- IAM roles restrict access to only the required secrets
- Network access is controlled by security groups
- All communication is encrypted in transit

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Ensure the foundation stack is deployed and outputs are available
2. **Secrets Manager Access**: Verify the Lambda has IAM permissions to access the secret
3. **Network Connectivity**: Check that the Lambda is in the correct VPC and has access to the cache
4. **Password Format**: The secret should contain a JSON object with a `password` field

### Debugging

Enable debug logging by setting `NODE_ENV=development` in the Lambda environment variables.

## Local Development

For local development, the cache will fall back to `redis://localhost:6379` if no CloudFormation environment variables are provided. 