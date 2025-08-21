# A2A VC (Venture Capital) Endpoint

The `/vc` endpoint provides A2A (Agent-to-Agent) style functionality for venture capital operations using the JSON-RPC 2.0 protocol.

## Overview

This endpoint follows the A2A protocol built on top of JSON-RPC 2.0, providing a standardized interface for venture capital operations. It supports task management, investment opportunity tracking, and other VC-related operations through JSON-RPC method calls.

## Endpoint

```
POST /vc
```

## JSON-RPC Format

All requests to the VC endpoint use the standard JSON-RPC 2.0 format:

```json
{
  "jsonrpc": "2.0",
  "id": "unique_request_id",
  "method": "method_name",
  "params": {
    // Method-specific parameters
  }
}
```

## Supported Methods

### 1. Initialize

**Method:** `initialize`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "initialize",
  "params": {}
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "name": "vc-service",
    "version": "1.0.0",
    "capabilities": {
      "vc": {
        "supported": true,
        "features": ["task-management", "venture-capital-operations", "investment-tracking"]
      }
    }
  }
}
```

### 2. Task Send

**Method:** `task/send`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "method": "task/send",
  "params": {}
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "result": {
    "taskId": "vc_task_1755815643074",
    "state": "completed",
    "message": "Hello world!",
    "timestamp": "2025-08-21T22:34:03.074Z",
    "metadata": {
      "service": "vc-service",
      "operation": "task/send",
      "status": "success"
    }
  }
}
```

### 3. List Tools

**Method:** `tools/list`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "method": "tools/list",
  "params": {}
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "result": {
    "tools": [
      {
        "name": "task_send",
        "description": "Send a task to the VC service",
        "inputSchema": {
          "type": "object",
          "properties": {
            "taskType": {
              "type": "string",
              "description": "Type of task to send",
              "enum": ["investment_review", "due_diligence", "portfolio_analysis"]
            },
            "priority": {
              "type": "string",
              "description": "Priority level of the task",
              "enum": ["low", "medium", "high", "urgent"]
            }
          }
        }
      },
      {
        "name": "get_investment_opportunities",
        "description": "Get available investment opportunities",
        "inputSchema": {
          "type": "object",
          "properties": {
            "sector": {
              "type": "string",
              "description": "Sector to filter opportunities"
            },
            "stage": {
              "type": "string",
              "description": "Investment stage",
              "enum": ["seed", "series_a", "series_b", "series_c", "growth"]
            }
          }
        }
      }
    ]
  }
}
```

### 4. Call Tools

**Method:** `tools/call`

#### Task Send Tool

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "4",
  "method": "tools/call",
  "params": {
    "name": "task_send",
    "arguments": {
      "taskType": "investment_review",
      "priority": "high"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "4",
  "result": {
    "taskId": "vc_task_1755815643075",
    "state": "completed",
    "message": "Hello world!",
    "timestamp": "2025-08-21T22:34:03.075Z",
    "taskType": "investment_review",
    "priority": "high"
  }
}
```

#### Get Investment Opportunities Tool

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "5",
  "method": "tools/call",
  "params": {
    "name": "get_investment_opportunities",
    "arguments": {
      "sector": "Technology",
      "stage": "series_a"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "5",
  "result": {
    "opportunities": [
      {
        "id": "opp_1",
        "company": "TechStartup Alpha",
        "sector": "Technology",
        "stage": "Series A",
        "valuation": 5000000,
        "description": "AI-powered SaaS platform"
      }
    ],
    "count": 1,
    "message": "Investment opportunities retrieved successfully"
  }
}
```

## Task Types

Supported task types:
- `investment_review` - Review investment opportunities
- `due_diligence` - Perform due diligence on companies
- `portfolio_analysis` - Analyze portfolio performance

## Priority Levels

Supported priority levels:
- `low` - Low priority tasks
- `medium` - Medium priority tasks
- `high` - High priority tasks
- `urgent` - Urgent tasks requiring immediate attention

## Investment Stages

Supported investment stages:
- `seed` - Seed stage investments
- `series_a` - Series A round
- `series_b` - Series B round
- `series_c` - Series C round
- `growth` - Growth stage investments

## Error Handling

When an error occurs, the endpoint returns standard JSON-RPC error responses:

```json
{
  "jsonrpc": "2.0",
  "id": "request_id",
  "error": {
    "code": -32603,
    "message": "Internal error processing VC request",
    "data": "Additional error details"
  }
}
```

Common error codes:
- `-32600` - Invalid Request
- `-32601` - Method not found
- `-32602` - Invalid params
- `-32603` - Internal error

## Testing

### Local Development

1. Start the local server:
   ```bash
   npm run start:local
   ```

2. Test the endpoint:
   ```bash
   # Initialize the service
   curl -X POST http://localhost:3000/vc \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"1","method":"initialize","params":{}}'
   
   # Send a task (returns "Hello world!")
   curl -X POST http://localhost:3000/vc \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"2","method":"task/send","params":{}}'
   
   # List available tools
   curl -X POST http://localhost:3000/vc \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"3","method":"tools/list","params":{}}'
   ```

### SAM Local Testing

```bash
# Test VC operations
npm run test:vc
npm run test:vc-task-send
```

## Implementation Details

The VC endpoint is implemented in `src/a2a/vc/handler.ts` and provides:

- In-memory task management (can be extended to use Redis/DynamoDB)
- Full JSON-RPC 2.0 compliance
- A2A protocol method structure (`initialize`, `task/send`, `tools/list`, `tools/call`)
- Comprehensive error handling with standard JSON-RPC error codes
- Tool-based architecture for VC operations

## A2A Protocol Compliance

This endpoint follows the A2A protocol by implementing:

1. **Service Discovery**: `initialize` method returns service capabilities
2. **Task Management**: `task/send` method handles task creation and returns completed state
3. **Tool Discovery**: `tools/list` method returns available tools
4. **Tool Execution**: `tools/call` method executes specific VC operations
5. **Standardized Responses**: All responses follow JSON-RPC 2.0 format
6. **Error Handling**: Standard JSON-RPC error codes and messages

## Key Features

- **Task Completion**: The `task/send` method always returns a task with `state: "completed"` and `message: "Hello world!"`
- **Venture Capital Focus**: Specialized for VC operations like investment reviews and opportunity tracking
- **Flexible Task Types**: Supports various VC task types with configurable priorities
- **Investment Tracking**: Provides tools for managing investment opportunities and portfolio analysis

## Future Enhancements

- Database persistence (Redis/DynamoDB)
- Authentication and authorization
- Real-time task notifications
- Investment portfolio management
- Due diligence workflow automation
- Market analysis and reporting tools
- Additional A2A protocol methods (streaming, notifications, etc.)
