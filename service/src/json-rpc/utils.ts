import { ClientAgentSession } from "@agentic-profile/auth";
import { AGENTIC_AUTH_REQUIRED_JSON_RPC_CODE, JsonRpcResponse } from "./types.js";
import { parseDid } from "../utils/did.js";

// Create RPC response with direct result
export function jrpcResult(id: string | number, result: any): JsonRpcResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        result
    };
}

// Create RPC response with error
export function jrpcError(id: string | number, code: number, message: string, data?: any): JsonRpcResponse {
    return {
        jsonrpc: '2.0',
        id: id as string | number,
        error: {
            code,
            message,
            data
        }
    };
}

export function jrpcErrorAuthRequired(id: string | number): JsonRpcResponse {
    return jrpcError(id, AGENTIC_AUTH_REQUIRED_JSON_RPC_CODE, 'Authentication required');
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

export function resolveAgentId(session: ClientAgentSession): { did: string, fragment: string } {
    return parseDid(session.agentDid);
}
