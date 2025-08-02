# Agentic Profile MCP Lambda Function

A TypeScript Lambda function that implements the Model Context Protocol (MCP) for agentic profiles. This function can be deployed to AWS Lambda using CloudFormation.

Created by Cursor:
```
Create a new typescript project in the folder agentic-profile-mcp that has a Lambda handler function in index.ts and can be deployed to Lambda using cloudformation
```

## Features

- **MCP Protocol Support**: Implements the Model Context Protocol for agentic profile management
- **TypeScript**: Written in TypeScript with proper type definitions
- **AWS Lambda**: Designed to run on AWS Lambda with API Gateway integration
- **CloudFormation**: Includes CloudFormation template for infrastructure as code
- **CORS Support**: Configured with CORS headers for web client access
- **Error Handling**: Comprehensive error handling and logging

## Project Structure

```
agentic-profile-mcp/
├── src/
│   └── index.ts          # Main Lambda handler
├── template.yaml         # CloudFormation template
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Prerequisites

- Node.js 18 or later
- AWS CLI configured with appropriate credentials
- AWS SAM CLI (optional, for local testing)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build the TypeScript code:
```bash
npm run build
```

## Local Development

### Running Tests
```bash
npm test
```

### Building
```bash
npm run build
```

### Clean Build
```bash
npm run clean && npm run build
```

## Deployment

### Using CloudFormation

1. Build the project:
```bash
npm run build
```

2. Package the function:
```bash
npm run package
```

3. Deploy using CloudFormation:
```bash
npm run deploy
```

Or manually:
```bash
aws cloudformation deploy \
  --template-file template.yaml \
  --stack-name agentic-profile-mcp \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides Environment=dev
```

### Environment Variables

The CloudFormation template supports the following environment parameter:
- `Environment`: Set to `dev`, `staging`, or `prod` (default: `dev`)

## API Endpoints

### Health Check
- **GET** `/` - Health check endpoint
- Returns service status and timestamp

### MCP Protocol Endpoints
- **POST** `/` - MCP protocol requests
- Supports the following MCP methods:
  - `initialize` - Initialize the MCP connection
  - `tools/list` - List available tools
  - `tools/call` - Execute a tool

## Available Tools

### get_profile
Retrieves an agentic profile by DID.

**Parameters:**
- `did` (string, required): The DID of the profile to retrieve

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_profile",
    "arguments": {
      "did": "did:example:123"
    }
  }
}
```

### update_profile
Updates an agentic profile.

**Parameters:**
- `did` (string, required): The DID of the profile to update
- `profile` (object, required): The profile data to update

**Example:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "update_profile",
    "arguments": {
      "did": "did:example:123",
      "profile": {
        "name": "Updated Profile",
        "description": "Updated description"
      }
    }
  }
}
```

## Infrastructure

The CloudFormation template creates:

- **Lambda Function**: The main function with Node.js 18 runtime
- **IAM Role**: Execution role with CloudWatch Logs permissions
- **API Gateway**: REST API with proxy integration
- **CloudWatch Log Group**: For function logs with 14-day retention

## Monitoring

- **CloudWatch Logs**: Function logs are automatically sent to CloudWatch
- **API Gateway**: Request/response metrics available in CloudWatch
- **Lambda Metrics**: Invocation count, duration, and error rates

## Development

### Adding New Tools

1. Add the tool definition to `handleToolsList()` in `src/index.ts`
2. Add the tool handler to `handleToolsCall()` in `src/index.ts`
3. Implement the tool handler function
4. Update tests if applicable

### Local Testing

You can test the function locally using AWS SAM:

```bash
# Install AWS SAM CLI if not already installed
# Then run:
sam local invoke AgenticProfileMCPFunction --event events/test-event.json
```

## Troubleshooting

### Common Issues

1. **Deployment Fails**: Check AWS credentials and permissions
2. **Function Timeout**: Increase timeout in CloudFormation template
3. **Memory Issues**: Increase memory allocation in CloudFormation template
4. **CORS Errors**: Verify CORS headers in the function response

### Logs

Check CloudWatch Logs for the function:
```bash
aws logs tail /aws/lambda/agentic-profile-mcp-dev --follow
```

## License

MIT License - see LICENSE file for details. 