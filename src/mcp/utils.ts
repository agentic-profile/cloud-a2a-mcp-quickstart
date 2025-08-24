import {
    ContentBlock,
    JSONRPCRequest,
    JSONRPCResponse,
    JSONRPCError
} from '@modelcontextprotocol/sdk/types.js';
import { Request, Response } from 'express';
import { jrpcError, describeJsonRpcRequestError } from '../json-rpc';

export type MCPMethodHandler = (rpcRequest: JSONRPCRequest) => Promise<JSONRPCResponse | JSONRPCError | null>;

export async function handleMCPMethod(req: Request, res: Response, methodHandler: MCPMethodHandler) {
    try {
        const rpcRequest: JSONRPCRequest = req.body as JSONRPCRequest;
        const { id, method } = rpcRequest;
    
        // Validate JSON-RPC request
        const requestError = describeJsonRpcRequestError( rpcRequest );
        if ( requestError ) {
            res.status(400).json( jrpcError( id || 'unknown', -32600, requestError ) );
            return;
        }

        const result = await methodHandler( rpcRequest );
        if( result ) {
            res.json(result); // Return error response as-is
        } else {
            res.status(400).json( jrpcError( id!, -32601, `Method ${method} not found` ) );
        }
    } catch (error) {
        console.error('MCP method handler error:', error);
        res.status(500).json( jrpcError( req.body.id || 'unknown', -32603, `Internal error: ${error}` ) );
    }
}

// Create RPC response with content (MCP standard format)
export function mcpContentResponse(id: string | number, content: ContentBlock[]): JSONRPCResponse {
    return {
        jsonrpc: '2.0',
        id,
        result: {
            content 
        }
    };
}

export function mcpTextContentResponse( id: string | number, text: string ): JSONRPCResponse {
    const content = [{ type: "text" as const, text }];
    return mcpContentResponse( id, content );
}
