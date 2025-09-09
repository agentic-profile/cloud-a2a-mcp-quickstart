# DynamoDB VentureProfileStore

This document describes the DynamoDB implementation of the `VentureProfileStore` interface.

## Overview

The `VentureProfileStore` provides persistent storage for venture profiles using AWS DynamoDB. It implements the interface defined in `src/stores/types.ts` and provides methods to save and load venture profiles.

## Features

- **Persistent Storage**: Uses AWS DynamoDB for reliable, scalable storage
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Comprehensive error handling with descriptive error messages
- **Environment Configuration**: Configurable table name via environment variables
- **GSI Support**: Includes Global Secondary Index for efficient querying by type and creation date

## Dependencies

The implementation requires the following AWS SDK packages:
- `@aws-sdk/client-dynamodb`: Core DynamoDB client
- `@aws-sdk/lib-dynamodb`: Document client for easier data handling

## Configuration

### Environment Variables

- `DYNAMODB_TABLE_NAME`: The name of the DynamoDB table to use (defaults to `agentic-service-a2a-mcp-dev-dev`)

### DynamoDB Table Schema

The store expects a DynamoDB table with the following structure:

**Primary Key:**
- `id` (String): Primary key, format: `venture-profile:{did}`

**Attributes:**
- `type` (String): Always "venture-profile"
- `uuid` (String): Unique identifier for the venture profile
- `did` (String): Decentralized identifier
- `name` (String): Venture name
- `description` (String): Venture description
- `createdAt` (String): ISO 8601 timestamp
- `updatedAt` (String): ISO 8601 timestamp

**Global Secondary Index:**
- `TypeIndex`: 
  - Partition Key: `type`
  - Sort Key: `createdAt`
  - Projection: ALL

## Usage

```typescript
import { ventureProfileStore } from './stores/dynamodb-store.js';
import { VentureProfile } from './stores/types.js';

// Create a venture profile
const profile: VentureProfile = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    did: 'did:example:venture123',
    name: 'TechStart Inc.',
    description: 'A revolutionary AI-powered startup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// Save the profile
await ventureProfileStore.saveVentureProfile(profile);

// Load the profile
const loadedProfile = await ventureProfileStore.loadVentureProfile(profile.did);
```

## API Reference

### `saveVentureProfile(profile: VentureProfile): Promise<void>`

Saves a venture profile to DynamoDB.

**Parameters:**
- `profile`: The venture profile to save

**Throws:**
- `Error`: If the save operation fails

### `loadVentureProfile(did: string): Promise<VentureProfile | undefined>`

Loads a venture profile from DynamoDB by its DID.

**Parameters:**
- `did`: The decentralized identifier of the venture profile

**Returns:**
- `VentureProfile | undefined`: The loaded profile or undefined if not found

**Throws:**
- `Error`: If the load operation fails

## Error Handling

The store provides comprehensive error handling:

- **DynamoDB Errors**: Wrapped in descriptive error messages
- **Network Issues**: Properly handled and re-thrown with context
- **Missing Items**: Returns `undefined` for non-existent profiles
- **Invalid Data**: TypeScript compilation prevents invalid data structures

## Testing

The implementation includes comprehensive unit tests in `src/__tests__/dynamodb-store.test.ts`:

- Tests for successful save operations
- Tests for successful load operations
- Tests for error handling scenarios
- Tests for non-existent profile handling

Run tests with:
```bash
npm test
```

## Example

See `examples/dynamodb-venture-profile-usage.ts` for a complete usage example.

## AWS Permissions

The Lambda function requires the following DynamoDB permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/agentic-service-a2a-mcp-*"
        }
    ]
}
```

These permissions are already configured in the CloudFormation template.
