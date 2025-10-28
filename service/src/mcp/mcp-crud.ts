import { JSONRPCError, JSONRPCRequest } from "@modelcontextprotocol/sdk/types.js";
import { mcpTextContentResponse, mcpResultResponse } from "./misc.js";
import { jrpcError } from "../json-rpc/index.js";
import { ClientAgentSession } from "@agentic-profile/auth";
import { StoreItem, ItemStore } from "../stores/types.js";
import { JSONRPCResponse } from "@modelcontextprotocol/sdk/types.js";

export type ResolveItemId<T> = (item: T | undefined, session: ClientAgentSession, params: any | undefined ) => string;
export type ResolveAuthor<T> = (item: T | undefined, session: ClientAgentSession, params: any | undefined ) => string | undefined;

export type Options<T> = {
    itemKey?: string;
    authorKey?: string
    idResolver: ResolveItemId<T>;
    authorResolver?: ResolveAuthor<T>;
}

export function mcpCrud<T extends StoreItem>( store: ItemStore<T>, options: Options<T> ) {
    const debugLabel = store.name();
    const { idResolver, itemKey = "item", authorKey = "authorDid", authorResolver } = options;
    return {
        // Only the item owner can add/update items
        async handleUpdate(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            const item = request.params?.[itemKey] as StoreItem | undefined;
            if (!item)
                return jrpcError(request.id!, -32602, `Invalid ${debugLabel} params: item is required`);

            try {
                // I can only upload my own profile
                item.id = idResolver(item as T,session,request.params);
                item[authorKey] = authorResolver?.(item as T,session,request.params);
                item.updated = new Date().toISOString();

                await store.updateItem(item as T);
                return mcpTextContentResponse(request.id!, `${debugLabel} item updated successfully`);
            } catch (error:any) {
                return jrpcError(request.id!, -32603, `Failed to update ${debugLabel} item ${item.id}: ${extractErrorMessage(error)}`, error);
            }
        },

        // Only the item owner can directly read their own items
        async handleRead(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            let id;
            try {
                id = idResolver(undefined,session,request.params);
                const result = await store.readItem(id);
                return mcpResultResponse(request.id!, { [itemKey]:result });
            } catch (error) {
                return jrpcError(request.id!, -32603, `Failed to read ${debugLabel} item ${id}: ${extractErrorMessage(error)}`, error);
            }
        },

        async handleDelete(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
            let id;
            try {
                id = idResolver(undefined,session,request.params);
                await store.deleteItem(id);
                return mcpTextContentResponse(request.id!, `${debugLabel} item ${id}deleted successfully`);
            } catch (error) {
                return jrpcError(request.id!, -32603, `Failed to delete ${debugLabel} item ${id}: ${extractErrorMessage(error)}`, error);
            }
        }
    }
}

function extractErrorMessage(error: any): string {
    if( error.message )
        return error.message;

    let details = JSON.stringify(error);
    if( details.length > 40 )
        details = details.substring(0, 40) + '...';

    return `${error}: ${details}`;
}