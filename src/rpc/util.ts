import { JsonRPCResponse } from '../types';

// Create RPC response with direct result
export function rpcResult(id: string | number | null, result: any): JsonRPCResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        result
    };
}

// Create RPC response with error
export function rpcError(id: string | number | null, code: number, message: string): JsonRPCResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        error: {
            code,
            message
        }
    };
}

// Create RPC response with content (MCP standard format)
export function rpcContent(id: string | number | null, content: string | any): JsonRPCResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        result: {
            content: [
                {
                    type: 'text',
                    text: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
                }
            ]
        }
    };
}
