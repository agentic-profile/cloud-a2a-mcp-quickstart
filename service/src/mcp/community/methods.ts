import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { jrpcError } from '../../json-rpc/index.js';
import {resolveAgentId } from '../misc.js';
import { handleAbout, handleRecentUpdates } from '../mcp-misc.js';

import { ClientAgentSession } from '@agentic-profile/auth';
import { StoreItem } from '../../stores/types.js';
import { mcpCrud } from '../mcp-crud.js';

// from https://opensessions.io/
const KINDS = [ 'volunteer' , 'charity' , 'club' , 'facility' , 'provider' ]; // TODO refine this

const TABLE_NAME = process.env.DYNAMODB_COMMUNITY_PROFILES_TABLE_NAME || 'community-profiles';
const store = itemStore<StoreItem>({tableName: TABLE_NAME});

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

/* Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}*/
