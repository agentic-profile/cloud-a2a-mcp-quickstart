import { ClientAgentSession } from "@agentic-profile/auth";

export const AGENTIC_AUTH_REQUIRED_JSON_RPC_CODE = -13000;

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
    | { result?: never; error: { code: number; message: string, data?: any } }
)

/**
 * Generic method handler for JSON RPC requests
 */
export type JsonRpcMethodHandler = (jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null) => Promise<JsonRpcResponse | null>;
