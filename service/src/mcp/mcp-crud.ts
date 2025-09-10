import { JSONRPCError, JSONRPCRequest } from "@modelcontextprotocol/sdk/types.js";
import { mcpTextContentResponse, mcpResultResponse } from "./utils.js";
import { jrpcError } from "../json-rpc/index.js";
import { ClientAgentSession } from "@agentic-profile/auth";
import { DatedItem, ItemStore } from "../stores/types.js";
import { JSONRPCResponse } from "@modelcontextprotocol/sdk/types.js";

export type ResolveItemId = (session: ClientAgentSession) => string;

function resolveItemId(session: ClientAgentSession): string {
    return session.agentDid.split('#')[0];
}

export function mcpCrud<T extends DatedItem>( store: ItemStore<T>, idResolver: ResolveItemId = resolveItemId ) {
    return {
        async handleUpdate(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            const profile = request.params?.profile as DatedItem | undefined;
            if (!profile)
                return jrpcError(request.id!, -32602, 'Invalid params: profile is required');

            // I can only upload my own profile
            profile.id = idResolver(session);
            profile.updated = new Date().toISOString();

            try {
                await store.updateItem(profile as T);
                return mcpTextContentResponse(request.id!, `Venture profile updated successfully`);
            } catch (error) {
                return jrpcError(request.id!, -32603, 'Failed to update venture profile:' + (error as Error).message);
            }
        },

        async handleRead(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            try {
                const result = await store.readItem(idResolver(session));
                return mcpResultResponse(request.id!, { profile:result });
            } catch (error) {
                return jrpcError(request.id!, -32603, 'Failed to update venture profile:' + (error as Error).message);
            }
        },

        async handleDelete(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            try {
                await store.deleteItem(idResolver(session));
                return mcpTextContentResponse(request.id!, `Venture profile updated successfully`);
            } catch (error) {
                return jrpcError(request.id!, -32603, 'Failed to update venture profile:' + (error as Error).message);
            }
        }
    }
}