import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

interface MCPRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));
  console.log('Context:', JSON.stringify(context, null, 2));

  try {
    // Parse the request body
    const body = event.body ? JSON.parse(event.body) : {};
    
    // Handle different HTTP methods
    switch (event.httpMethod) {
      case 'POST':
        return await handleMCPRequest(body, event);
      case 'GET':
        return await handleHealthCheck();
      default:
        return {
          statusCode: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
          },
          body: JSON.stringify({
            error: 'Method not allowed'
          })
        };
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};

async function handleMCPRequest(body: any, _event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const request: MCPRequest = body;
  
  // Validate JSON-RPC request
  if (!request.jsonrpc || request.jsonrpc !== '2.0' || !request.id || !request.method) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
          message: 'Invalid Request'
        }
      })
    };
  }

  // Handle different MCP methods
  let response: MCPResponse;
  
  switch (request.method) {
    case 'initialize':
      response = await handleInitialize(request);
      break;
    case 'tools/list':
      response = await handleToolsList(request);
      break;
    case 'tools/call':
      response = await handleToolsCall(request);
      break;
    default:
      response = {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: 'Method not found'
        }
      };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify(response)
  };
}

async function handleInitialize(request: MCPRequest): Promise<MCPResponse> {
  return {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'agentic-profile-mcp',
        version: '1.0.0'
      }
    }
  };
}

async function handleToolsList(request: MCPRequest): Promise<MCPResponse> {
  return {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      tools: [
        {
          name: 'get_profile',
          description: 'Get an agentic profile by DID',
          inputSchema: {
            type: 'object',
            properties: {
              did: {
                type: 'string',
                description: 'The DID of the profile to retrieve'
              }
            },
            required: ['did']
          }
        },
        {
          name: 'update_profile',
          description: 'Update an agentic profile',
          inputSchema: {
            type: 'object',
            properties: {
              did: {
                type: 'string',
                description: 'The DID of the profile to update'
              },
              profile: {
                type: 'object',
                description: 'The profile data to update'
              }
            },
            required: ['did', 'profile']
          }
        }
      ]
    }
  };
}

async function handleToolsCall(request: MCPRequest): Promise<MCPResponse> {
  const { name, arguments: args } = request.params || {};
  
  switch (name) {
    case 'get_profile':
      return await handleGetProfile(request, args);
    case 'update_profile':
      return await handleUpdateProfile(request, args);
    default:
      return {
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: 'Tool not found'
        }
      };
  }
}

async function handleGetProfile(request: MCPRequest, args: any): Promise<MCPResponse> {
  const { did } = args;
  
  if (!did) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32602,
        message: 'Invalid params: did is required'
      }
    };
  }

  // Mock profile data - in a real implementation, this would fetch from a database
  const profile = {
    did,
    name: 'Agent Profile',
    description: 'An agentic profile',
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };

  return {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      content: [
        {
          type: 'text',
          text: JSON.stringify(profile, null, 2)
        }
      ]
    }
  };
}

async function handleUpdateProfile(request: MCPRequest, args: any): Promise<MCPResponse> {
  const { did, profile } = args;
  
  if (!did || !profile) {
    return {
      jsonrpc: '2.0',
      id: request.id,
      error: {
        code: -32602,
        message: 'Invalid params: did and profile are required'
      }
    };
  }

  // Mock update - in a real implementation, this would update a database
  const updatedProfile = {
    ...profile,
    did,
    updated: new Date().toISOString()
  };

  return {
    jsonrpc: '2.0',
    id: request.id,
    result: {
      content: [
        {
          type: 'text',
          text: `Profile updated successfully: ${JSON.stringify(updatedProfile, null, 2)}`
        }
      ]
    }
  };
}

async function handleHealthCheck(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'agentic-profile-mcp'
    })
  };
} 