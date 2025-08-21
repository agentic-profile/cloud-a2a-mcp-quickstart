# A2A Venture Endpoint

The `/venture` endpoint provides A2A (Agent-to-Agent) style functionality for managing ventures and business initiatives using the JSON-RPC 2.0 protocol.

## Overview

This endpoint follows the A2A protocol built on top of JSON-RPC 2.0, providing a standardized interface for venture management operations. It supports creating, reading, updating, and deleting ventures through JSON-RPC method calls.

## Endpoint

```
POST /venture
```

## JSON-RPC Format

All requests to the venture endpoint use the standard JSON-RPC 2.0 format:

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
    "name": "venture-service",
    "version": "1.0.0",
    "capabilities": {
      "venture": {
        "supported": true,
        "features": ["venture-creation", "venture-management", "venture-analytics"]
      }
    }
  }
}
```

### 2. List Tools

**Method:** `tools/list`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "method": "tools/list",
  "params": {}
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "result": {
    "tools": [
      {
        "name": "venture_create",
        "description": "Create a new venture with the specified details",
        "inputSchema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Name of the venture"
            },
            "description": {
              "type": "string",
              "description": "Description of the venture"
            },
            "type": {
              "type": "string",
              "description": "Type of venture (e.g., startup, business, project)",
              "enum": ["startup", "business", "project", "initiative"]
            }
          },
          "required": ["name"]
        }
      },
      {
        "name": "venture_list",
        "description": "List all available ventures",
        "inputSchema": {
          "type": "object",
          "properties": {}
        }
      },
      {
        "name": "venture_get",
        "description": "Get detailed information about a specific venture",
        "inputSchema": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "ID of the venture to retrieve"
            }
          },
          "required": ["id"]
        }
      },
      {
        "name": "venture_update",
        "description": "Update an existing venture with new information",
        "inputSchema": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "ID of the venture to update"
            },
            "updates": {
              "type": "object",
              "description": "Object containing the fields to update"
            }
          },
          "required": ["id", "updates"]
        }
      },
      {
        "name": "venture_delete",
        "description": "Delete a venture permanently",
        "inputSchema": {
          "type": "string",
          "description": "ID of the venture to delete"
        }
      }
    ]
  }
}
```

### 3. Call Tools

**Method:** `tools/call`

#### Create Venture

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "method": "tools/call",
  "params": {
    "name": "venture_create",
    "arguments": {
      "name": "Test Startup",
      "description": "A test startup venture",
      "type": "startup"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "result": {
    "type": "venture_created",
    "venture": {
      "id": "venture_1",
      "name": "Test Startup",
      "description": "A test startup venture",
      "type": "startup",
      "createdAt": "2025-08-21T22:13:06.369Z",
      "status": "active"
    },
    "message": "Venture created successfully"
  }
}
```

#### List Ventures

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "4",
  "method": "tools/call",
  "params": {
    "name": "venture_list",
    "arguments": {}
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "4",
  "result": {
    "type": "ventures_listed",
    "ventures": [
      {
        "id": "venture_1",
        "name": "Test Startup",
        "description": "A test startup venture",
        "type": "startup",
        "createdAt": "2025-08-21T22:13:06.369Z",
        "status": "active"
      }
    ],
    "count": 1,
    "message": "Ventures retrieved successfully"
  }
}
```

#### Get Venture

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "5",
  "method": "tools/call",
  "params": {
    "name": "venture_get",
    "arguments": {
      "id": "venture_1"
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
    "type": "venture_retrieved",
    "venture": {
      "id": "venture_1",
      "name": "Test Startup",
      "description": "A test startup venture",
      "type": "startup",
      "createdAt": "2025-08-21T22:13:06.369Z",
      "status": "active"
    },
    "message": "Venture retrieved successfully"
  }
}
```

#### Update Venture

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "6",
  "method": "tools/call",
  "params": {
    "name": "venture_update",
    "arguments": {
      "id": "venture_1",
      "updates": {
        "name": "Updated Startup Name",
        "description": "Updated description"
      }
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "6",
  "result": {
    "type": "venture_updated",
    "venture": {
      "id": "venture_1",
      "name": "Updated Startup Name",
      "description": "Updated description",
      "type": "startup",
      "createdAt": "2025-08-21T22:13:06.369Z",
      "updatedAt": "2025-08-21T22:13:10.000Z",
      "status": "active"
    },
    "message": "Venture updated successfully"
  }
}
```

#### Delete Venture

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "7",
  "method": "tools/call",
  "params": {
    "name": "venture_delete",
    "arguments": {
      "id": "venture_1"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "7",
  "result": {
    "type": "venture_deleted",
    "result": {
      "deletedId": "venture_1",
      "message": "Venture deleted successfully"
    },
    "message": "Venture deleted successfully"
  }
}
```

## Venture Types

Supported venture types:
- `startup` - New business ventures
- `business` - Established business operations
- `project` - Specific projects or initiatives
- `initiative` - Strategic initiatives

## Error Handling

When an error occurs, the endpoint returns standard JSON-RPC error responses:

```json
{
  "jsonrpc": "2.0",
  "id": "request_id",
  "error": {
    "code": -32603,
    "message": "Internal error processing venture request",
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
   curl -X POST http://localhost:3000/venture \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"1","method":"initialize","params":{}}'
   
   # List available tools
   curl -X POST http://localhost:3000/venture \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"2","method":"tools/list","params":{}}'
   
   # Create a venture
   curl -X POST http://localhost:3000/venture \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"3","method":"tools/call","params":{"name":"venture_create","arguments":{"name":"Test Venture","type":"startup"}}}'
   ```

### SAM Local Testing

```bash
# Test venture operations
npm run test:venture
npm run test:venture-create
```

## Implementation Details

The venture endpoint is implemented in `src/a2a/venture/handler.ts` and provides:

- In-memory venture storage (can be extended to use Redis/DynamoDB)
- Full JSON-RPC 2.0 compliance
- A2A protocol method structure (`initialize`, `tools/list`, `tools/call`)
- Comprehensive error handling with standard JSON-RPC error codes
- Tool-based architecture for venture operations

## A2A Protocol Compliance

This endpoint follows the A2A protocol by implementing:

1. **Service Discovery**: `initialize` method returns service capabilities
2. **Tool Discovery**: `tools/list` method returns available tools
3. **Tool Execution**: `tools/call` method executes specific venture operations
4. **Standardized Responses**: All responses follow JSON-RPC 2.0 format
5. **Error Handling**: Standard JSON-RPC error codes and messages

## Future Enhancements

- Database persistence (Redis/DynamoDB)
- Authentication and authorization
- Venture analytics and metrics
- Real-time notifications
- Venture collaboration features
- Additional A2A protocol methods (streaming, notifications, etc.)
