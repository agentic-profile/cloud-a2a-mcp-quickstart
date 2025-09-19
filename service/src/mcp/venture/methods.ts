import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { jrpcError } from '../../json-rpc/index.js';
import { mcpResultResponse } from '../utils.js';

import { ClientAgentSession } from '@agentic-profile/auth';
import { StoreItem } from '../../stores/types.js';
import { mcpCrud } from '../mcp-crud.js';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'venture-profiles';
const store = itemStore<StoreItem>('venture', TABLE_NAME);

function idResolver(_item: StoreItem | undefined, session: ClientAgentSession, _params: any | undefined ): string {
    return session.agentDid.split('#')[0];
}
const crud = mcpCrud(store, { idResolver, itemKey: "profile" } );

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { name } = request.params || {};

    console.log('🔍 handleToolsCall', name, session);
    
    switch (name) {
        case 'read':
            return await crud.handleRead(request,session);
        case 'update':
            return await crud.handleUpdate(request,session);
        case 'delete':
            return await crud.handleDelete(request,session);
        case 'recent-updates':
            return await handleRecentUpdates(request);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

export async function handleRecentUpdates(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {    
    try {
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        const since = request.params?.since || new Date( twentyFourHoursAgo ).toISOString();
        const items = await store.recentItems(since as string);
        return mcpResultResponse(request.id!, { items, since });
    } catch (error) {
        console.log('Get recent updates failed for table:', TABLE_NAME, error);
        return jrpcError(request.id!, -32603, `Failed to get recent updates for ${TABLE_NAME}: ${(error as Error).message}`);
    }
}
