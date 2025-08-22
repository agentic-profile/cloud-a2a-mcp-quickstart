# Agentic Profile A2A/MCP service running on AWS

Leverages CloudFormation to create a scalable A2A/MCP service with Lambda, Redis, DynamoDB, and S3. Uses
NAT to fetch external Agentic Profiles for authentication.

## Features

- A2A and MCP compliant API endpoints
- Support for profile retrieval and updates
- CloudFormation deployment
- A2A TaskHandler endpoints for HireMe, Venture, and VC operations

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

The project includes several test events for different MCP methods and A2A endpoints:

```bash
# Test initialize method
npm run test:local

# Test tools/list method
npm run test:tools-list

# Test get_profile tool
npm run test:get-profile

# Test A2A endpoints
npm run test:venture
npm run test:venture-create
npm run test:vc
npm run test:vc-task-send
npm run test:hireme
npm run test:hireme-taskhandler

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

## Web Interface

The service now includes a web interface for easy testing and exploration of the API endpoints.

- **URL**: `http://localhost:3000/` (local development)
- **Features**: Interactive API testing, endpoint documentation, and visual feedback
- **Files**: Served from the `/www` directory

## API Endpoints

### Health Check
- **Endpoint**: `GET /status`
- **Response**: Service health status and metadata

### MCP Protocol Endpoints
- **Base Path**: `/` (root)
- **Protocol**: JSON-RPC 2.0

#### Initialize
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":1,"method":"initialize"}`

#### Tools List
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":2,"method":"tools/list"}`

#### Tools Call
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_profile","arguments":{"did":"did:example:123"}}}`

#### Location Update
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":4,"method":"locationUpdate","params":{"coords":{"latitude":35.6762,"longitude":139.6503}}}`

#### Location Query
- **Method**: POST
- **Body**: `{"jsonrpc":"2.0","id":5,"method":"locationQuery"}`

### A2A TaskHandler Endpoints

#### `/a2a/hireme` - HireMe TaskHandler
- **Method**: POST
- **Purpose**: Handle HireMe related tasks and operations
- **Protocol**: A2A TaskHandler pattern

#### `/a2a/venture` - Venture TaskHandler
- **Method**: POST
- **Purpose**: Handle Venture creation and management tasks
- **Protocol**: A2A TaskHandler pattern

#### `/a2a/vc` - VC TaskHandler
- **Method**: POST
- **Purpose**: Handle VC (Venture Capital) related tasks
- **Protocol**: A2A TaskHandler pattern

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

## A2A TaskHandler Pattern

The service now supports an advanced A2A TaskHandler pattern using higher-order components (HOCs) for enhanced task management and monitoring.

### TaskHandler Architecture

The TaskHandler pattern provides:
- **AsyncGenerator-based task execution** with progress updates
- **Higher-order component middleware** for cross-cutting concerns
- **Real-time task state tracking** with detailed metadata
- **Composable middleware** for logging, timing, error handling, and progress tracking

### Available HOCs

- **`withLogging`**: Adds comprehensive logging to task execution
- **`withTiming`**: Measures and logs task execution time
- **`withErrorHandling`**: Provides standardized error handling and reporting
- **`withProgress`**: Adds progress tracking with percentage updates
- **`withDefaultMiddleware`**: Combines all HOCs for production use

### Example Usage

```typescript
// Core task handler
async function* handleHireMeTask(context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
    yield {
        taskId: `task_${Date.now()}`,
        state: 'running',
        message: 'Processing request...',
        progress: 25,
        timestamp: new Date().toISOString()
    };
    
    // Task logic here...
    
    yield {
        taskId: `task_${Date.now()}`,
        state: 'completed',
        message: 'Task completed successfully',
        progress: 100,
        timestamp: new Date().toISOString()
    };
}

// Apply HOC middleware
export const handleHireMeTaskWithMiddleware = withDefaultMiddleware(handleHireMeTask);
```

### TaskHandler Request/Response Format

#### Request Format
```json
{
  "id": "task-1",
  "method": "tasks/send",
  "params": {
    "position": "Senior Software Engineer",
    "experience": "5+ years"
  },
  "userId": "user-123",
  "includeAllUpdates": true
}
```

#### Response Format
```json
{
  "jsonrpc": "2.0",
  "id": "task-1",
  "result": {
    "taskId": "hireme_task_1234567890",
    "state": "completed",
    "message": "I accept! Here are my terms...",
    "progress": 100,
    "timestamp": "2025-01-15T10:30:00.000Z",
    "metadata": {
      "service": "hireme-service",
      "operation": "tasks/send",
      "status": "success",
      "offer": {
        "position": "Senior Software Engineer",
        "salary": "Competitive",
        "benefits": ["Health", "Dental", "Vision", "401k"]
      }
    },
    "allUpdates": [
      // Array of all task updates during execution
    ]
  }
}
```

## Project Structure

```
├── src/
│   ├── index.ts              # Main Lambda function
│   ├── index.local.ts        # Local development server
│   ├── router.ts             # Express router with all endpoints
│   ├── a2a/                  # A2A TaskHandler implementations
│   │   ├── hireme/           # HireMe task handlers
│   │   ├── venture/          # Venture task handlers
│   │   ├── vc/               # VC task handlers
│   │   └── utils.ts          # A2A utilities and middleware
│   ├── mcp/                  # MCP protocol implementations
│   │   └── location/         # Location-related MCP methods
│   └── cache/                # Redis caching layer
├── www/                      # Static web files
│   ├── index.html            # Web interface HTML
│   ├── styles.css            # Web interface styles
│   └── script.js             # Web interface JavaScript
├── events/                   # Test events for SAM local
│   ├── test-event.json
│   ├── test-tools-list.json
│   ├── test-get-profile.json
│   ├── test-venture.json
│   ├── test-venture-create.json
│   ├── test-vc-initialize.json
│   ├── test-vc-task-send.json
│   ├── test-hireme-task-send.json
│   └── test-hireme-taskhandler.json
├── foundation.yaml           # CloudFormation foundation template
├── mcp-service.yaml         # SAM template for local testing
└── package.json
```

## Testing

### Unit Tests
```bash
npm test
```

### Local Testing with SAM
```bash
# Test individual endpoints
npm run test:local
npm run test:tools-list
npm run test:get-profile
npm run test:venture
npm run test:venture-create
npm run test:vc
npm run test:vc-task-send
npm run test:hireme
npm run test:hireme-taskhandler

# Test all endpoints
npm run test:all
```

### Local Development Server
```bash
npm run start:local
```

This starts a local HTTP server on port 3000 with all endpoints available for testing.

### Web Interface Testing
The web interface at `http://localhost:3000/` provides an interactive way to test all API endpoints:

- **Health Check**: Test the service status endpoint
- **MCP Protocol**: Test JSON-RPC methods like initialize and tools/list
- **A2A Endpoints**: Test HireMe, Venture, and VC TaskHandler endpoints
- **Visual Feedback**: See real-time API responses and error handling

The interface includes keyboard shortcuts (Ctrl+1, Ctrl+2, Ctrl+3) for quick testing.

## Troubleshooting

### SAM Local Issues

If you encounter issues with SAM local:

1. Make sure you're using the `mcp-service.yaml` file
2. Ensure the `dist/` folder exists (run `npm run build` first)
3. Check that Docker is running

### Deployment Issues

If deployment fails:

1. Verify AWS credentials are configured: `aws configure list-profiles`
2. Ensure you have the correct permissions for the `agentic` profile
3. Check that the stack name doesn't conflict with existing stacks

### Redis Connection Issues

If you encounter Redis connection problems:

1. Check that Redis is running locally: `redis-cli ping`
2. Verify Redis connection settings in environment variables
3. Use the provided Redis troubleshooting scripts: `npm run test:redis`

## Example Queries

### Health Check
```bash
curl -X GET http://localhost:3000/status
```

### MCP Protocol
```bash
# Initialize
curl -X POST http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize"}'

# Tools List
curl -X POST http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

# Get Profile
curl -X POST http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_profile","arguments":{"did":"did:example:123"}}}'

# Location Update
curl -X POST http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":4,"method":"locationUpdate","params":{"coords":{"latitude":35.6762,"longitude":139.6503}}}'

# Location Query
curl -X POST http://localhost:3000/ \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":5,"method":"locationQuery"}'
```

### A2A Endpoints
```bash
# HireMe TaskHandler
curl -X POST http://localhost:3000/a2a/hireme \
  -H 'Content-Type: application/json' \
  -d '{"id":"1","method":"tasks/send","params":{"position":"Senior Engineer"},"includeAllUpdates":true}'

# Venture TaskHandler
curl -X POST http://localhost:3000/a2a/venture \
  -H 'Content-Type: application/json' \
  -d '{"id":"1","method":"venture/create","params":{"name":"Test Venture","type":"startup"}}'

# VC TaskHandler
curl -X POST http://localhost:3000/a2a/vc \
  -H 'Content-Type: application/json' \
  -d '{"id":"1","method":"task/send","params":{"investment":"1000000"}}'
```

### Production Environment
For production deployment, ensure Lambda endpoint is known:

```bash
export AGENTIC_HOST=https://ierurztomh.execute-api.us-west-2.amazonaws.com/dev
```

Then use the same endpoints with the production host.


