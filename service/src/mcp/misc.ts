import {
    ContentBlock,
    JSONRPCResponse,
} from '@modelcontextprotocol/sdk/types.js';

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

export type MCPResult = {
    [key: string]: unknown;
};

export function mcpResultResponse( id: string | number, result: MCPResult ): JSONRPCResponse {
    return {
        jsonrpc: '2.0',
        id,
        result
    };
}
