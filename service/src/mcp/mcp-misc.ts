import { JSONRPCError, JSONRPCRequest, JSONRPCResponse } from "@modelcontextprotocol/sdk/types.js";
import { jrpcError } from '../json-rpc/index.js';
import { mcpResultResponse } from './misc.js';
import { ItemStore, StoreItem } from '../stores/types.js';


export async function handleAbout<T extends StoreItem>(request: JSONRPCRequest, store: ItemStore<T>): Promise<JSONRPCResponse | JSONRPCError> {
    const { did } = request.params || {};

    if( !did )
        return jrpcError(request.id!, -32602, `Invalid params: did is required`);

    try {
        const query = {
            IndexName: "SubjectIndex",
            KeyConditionExpression: "subjectDid = :subjectDid",
            ExpressionAttributeValues: { ":subjectDid": did }
        }
        const profiles = await store.queryItems(query);
        return mcpResultResponse(request.id!, { profiles, did });
    } catch (error) {
        const details = `Failed to get About for ${did} in ${store.name()}: ${(error as Error).message}`;
        console.log( details, error);
        return jrpcError(request.id!, -32603, details);
    }
}

export async function handleRecentUpdates<T extends StoreItem>(request: JSONRPCRequest, store: ItemStore<T>): Promise<JSONRPCResponse | JSONRPCError> {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const {
        since = new Date( twentyFourHoursAgo ).toISOString(), // default to one day ago
        kind
    } = request.params || {};

    if( !kind )
        return jrpcError(request.id!, -32602, `Invalid params: kind is required`);

    try {
        const profiles = await store.recentItems(kind as string, since as string);
        return mcpResultResponse(request.id!, { profiles, since });
    } catch (error) {
        const details = `Failed to get recent updates for ${kind} in ${store.name()}: ${(error as Error).message}`;
        console.log( details, error);
        return jrpcError(request.id!, -32603, details);
    }
}