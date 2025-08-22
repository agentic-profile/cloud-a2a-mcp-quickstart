import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { Request, Response } from 'express';
import { rpcError, describeJsonRpcRequestError } from '../rpc';

export type MCPMethodHandler = (rpcRequest: JSONRPCRequest) => Promise<JSONRPCResponse | JSONRPCError | null>;

export async function handleMCPMethod(req: Request, res: Response, methodHandler: MCPMethodHandler) {
    try {
        const rpcRequest: JSONRPCRequest = req.body as JSONRPCRequest;
        const { id, method } = rpcRequest;
    
        // Validate JSON-RPC request
        const requestError = describeJsonRpcRequestError( rpcRequest );
        if ( requestError ) {
            res.status(400).json( rpcError( id || 'unknown', -32600, requestError ) );
            return;
        }

        const result = await methodHandler( rpcRequest );
        if( result ) {
            res.json(result); // Return error response as-is
        } else {
            res.status(400).json( rpcError( id!, -32601, `Method ${method} not found` ) );
        }
    } catch (error) {
        res.status(500).json( rpcError( req.body.id || 'unknown', -32603, 'Internal error' ) );
    }
}

// Create RPC response with content (MCP standard format)
export function rpcContent(id: string | number, content: string | any): JSONRPCResponse {
    if( typeof content === 'string' )
        content = [
            {
                type: 'text',
                text: content
            }
        ];

    return {
        jsonrpc: '2.0',
        id,
        result: {
            content 
        }
    };
}

