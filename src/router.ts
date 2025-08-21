import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { JsonRPCRequest, JsonRPCResponse } from './types';
import { handleInitialize, handleToolsList, handleToolsCall, handleLocationUpdate, handleLocationQuery } from './mcp/location/methods';


export async function handleJsonRPCRequest(body: any, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log( "handleJsonRPCRequest", body, JSON.stringify(event, null, 4) );
    
    const request: JsonRPCRequest = body;
    
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
    let response: JsonRPCResponse;
    
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
        case 'locationUpdate':
            response = await handleLocationUpdate(request, request.params);
            break;
        case 'locationQuery':
            response = await handleLocationQuery(request);
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