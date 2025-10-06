import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { jrpcError } from '../../json-rpc/index.js';
import { resolveAgentId } from '../../json-rpc/utils.js';

import { ClientAgentSession } from '@agentic-profile/auth';
import { StoreItem } from '../../stores/types.js';
import { mcpCrud } from '../mcp-crud.js';
import { handleAbout, handleRecentUpdates } from '../mcp-misc.js';

const TABLE_NAME = process.env.DYNAMODB_VENTURE_PROFILES_TABLE_NAME || 'venture-profiles';
const store = itemStore<StoreItem>({'tableName': TABLE_NAME});

const KINDS = [ 'venture' , 'capital', 'venture-strategy' ]; // TODO refine this

function idResolver(item: StoreItem | undefined, session: ClientAgentSession, params: any | undefined ): string {
    const kind = item?.kind ?? params?.kind;
    if( !KINDS.includes(kind) )
        throw new Error(`Invalid kind: ${kind}`);
    return `${resolveAgentId(session).did}^${kind}`;
}

function authorResolver(_item: StoreItem | undefined, session: ClientAgentSession, _params: any | undefined ): string {
    return resolveAgentId(session).did;
}

const crud = mcpCrud(store, { idResolver, itemKey: "profile", authorResolver, authorKey: "subjectDid" } );

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { name } = request.params || {};

    console.log('🔍 handleToolsCall', name, request, session);
    
    switch (name) {
        case 'read':
            return await crud.handleRead(request,session);
        case 'update':
            return await crud.handleUpdate(request,session);
        case 'delete':
            return await crud.handleDelete(request,session);
        case 'about':
            return await handleAbout(request,store);
        case 'recent-updates':
            return await handleRecentUpdates(request,store);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}


