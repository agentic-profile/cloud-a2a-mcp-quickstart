/**
 * Both A2A and MCP have their own opinionated variations of the JSON RPC schema.
 * The generic JsonRpcRequest and JsonRpcResponse types are designed to be interchangable so
 * requests can be safely typed until they are handed off to the appropriate
 * MCP or A2A implementation handler.
 */

export type JsonRpcRequest = {
    jsonrpc: "2.0";
    id: string | number | null;
    method: string;
    params: any;
}

export type JsonRpcResponse = {
    jsonrpc: "2.0";
    id: string | number;
} & (
    | { result: any; error?: never }
    | { result?: never; error: { code: number; message: string } }
)

// Create RPC response with direct result
export function jrpcResult(id: string | number, result: any): JsonRpcResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        result
    };
}

// Create RPC response with error
export function jrpcError(id: string | number, code: number, message: string): JsonRpcResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        error: {
            code,
            message
        }
    };
}

// Accept 'any' type to avoid type conflicts with MCP and A2A
export function describeJsonRpcRequestError(req: any): string | null | undefined {
    const { jsonrpc, id, method } = req;
    if ( !jsonrpc ) 
        return "Missing 'jsonrpc' parameter";
    else if( jsonrpc !== '2.0' )
        return `invalid 'jsonrpc' version: ${jsonrpc}`;
    else if( !id )
        return 'Missing JSON RPC request id';
    else if( !method )
        return 'Missing JSON RPCrequest method';
    else
        return null;  // null=success
}
