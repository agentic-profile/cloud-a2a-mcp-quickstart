# Agentic Profile A2A/MCP service running on AWS

Leverages CloudFormation to create a scalable A2A/MCP service with Lambda, Redis, DynamoDB, and S3.  Uses
NAT to fetch external Agentic Profiles for authentication.

## Features

- A2A and MCP compliant API endpoints
- Support for profile retrieval and updates
- CloudFormation deployment

## Development

### Prerequisites

- Node.js 22+
- AWS CLI configured with `agentic` profile
- AWS SAM CLI

### Installation

```bash
npm install
```

### Building

```bash
npm run build
```

### Local Testing

The project includes several test events for different MCP methods:

```bash
# Test initialize method
npm run test:local

# Test tools/list method
npm run test:tools-list

# Test get_profile tool
npm run test:get-profile

# Test all methods
npm run test:all
```

### Local Development with Redis

1. Install Redis
2. Start Redis locally

  ```bash
  redis-server
  ```

3. Start MCP server

  ```bash
  npm run start:local
  ```

### Deployment

Deploy to AWS using CloudFormation:

```bash
npm run deploy
```

This will:
1. Build the TypeScript code
2. Package the function
3. Deploy using CloudFormation with the `agentic` profile

## API Endpoints

### Initialize
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":1,"method":"initialize"}`

### Tools List
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":2,"method":"tools/list"}`

### Get Profile
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_profile","arguments":{"did":"did:example:123"}}}`

## Available Tools

### get_profile
Retrieves an agentic profile by DID.

**Parameters:**
- `did` (string, required): The DID of the profile to retrieve

### update_profile
Updates an agentic profile.

**Parameters:**
- `did` (string, required): The DID of the profile to update
- `profile` (object, required): The profile data to update

## Project Structure

```
├── src/
│   └── index.ts          # Main Lambda function
├── events/               # Test events for SAM local
│   ├── test-event.json
│   ├── test-tools-list.json
│   └── test-get-profile.json
├── template.yaml         # CloudFormation template
├── sam-template.yaml     # SAM template for local testing
└── package.json
```

## Troubleshooting

### SAM Local Issues

If you encounter issues with SAM local:

1. Make sure you're using the `sam-template.yaml` file
2. Ensure the `dist/` folder exists (run `npm run build` first)
3. Check that Docker is running

### Deployment Issues

If deployment fails:

1. Verify AWS credentials are configured: `aws configure list-profiles`
2. Ensure you have the correct permissions for the `agentic` profile
3. Check that the stack name doesn't conflict with existing stacks 

## Example queries:

Ensure Lambda endpoint is known:

```bash
export AGENTIC_HOST=https://ierurztomh.execute-api.us-west-2.amazonaws.com/dev
```

Store user location:

```bash
curl -X POST $AGENTIC_HOST \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"locationUpdate","params":{"coords":{"latitude":35.6762,"longitude":139.6503}}}'
```

Fetch user location:

```bash
curl -X POST $AGENTIC_HOST \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"locationQuery"}'
```


