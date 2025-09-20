import { JSONRPCError, JSONRPCRequest } from "@modelcontextprotocol/sdk/types.js";
import { mcpTextContentResponse, mcpResultResponse } from "./utils.js";
import { jrpcError } from "../json-rpc/index.js";
import { ClientAgentSession } from "@agentic-profile/auth";
import { StoreItem, ItemStore } from "../stores/types.js";
import { JSONRPCResponse } from "@modelcontextprotocol/sdk/types.js";

export type ResolveItemId<T> = (item: T | undefined, session: ClientAgentSession, params: any | undefined ) => string;
export type ResolveOwner<T> = (item: T | undefined, session: ClientAgentSession, params: any | undefined ) => string | undefined;

export type Options<T> = {
    itemKey?: string;
    idResolver: ResolveItemId<T>;
    ownerResolver?: ResolveOwner<T>;
}

export function mcpCrud<T extends StoreItem>( store: ItemStore<T>, options: Options<T> ) {
    const debugLabel = store.name();
    const { idResolver, itemKey = "item", ownerResolver } = options;
    return {
        // Only the wallet owner can add/update wallet items
        async handleUpdate(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            const item = request.params?.[itemKey] as StoreItem | undefined;
            if (!item)
                return jrpcError(request.id!, -32602, `Invalid ${debugLabel} params: item is required`);

            // I can only upload my own profile
            item.id = idResolver(item as T,session,request.params);
            item.ownerDid = ownerResolver?.(item as T,session,request.params);
            item.updated = new Date().toISOString();

            try {
                await store.updateItem(item as T);
                return mcpTextContentResponse(request.id!, `${debugLabel} item updated successfully`);
            } catch (error) {
                return jrpcError(request.id!, -32603, 'Failed to update ${debugLabel} item:' + (error as Error).message);
            }
        },

        // Only the wallet owner can directly read their own wallet items
        async handleRead(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            const id = idResolver(undefined,session,request.params);
            try {
                const result = await store.readItem(id);
                return mcpResultResponse(request.id!, { [itemKey]:result });
            } catch (error) {
                return jrpcError(request.id!, -32603, `Failed to read ${debugLabel} item ${id}:` + (error as Error).message);
            }
        },

        async handleDelete(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            const id = idResolver(undefined,session,request.params);
            try {
                await store.deleteItem(id);
                return mcpTextContentResponse(request.id!, `${debugLabel} item ${id}deleted successfully`);
            } catch (error) {
                return jrpcError(request.id!, -32603, `Failed to delete ${debugLabel} item ${id}:` + (error as Error).message);
            }
        }
    }
}






/*

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
}*/