import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { jrpcError, jrpcErrorAuthRequired } from '../../json-rpc/index.js';
import { mcpResultResponse } from '../misc.js';
import { handleQuery } from './query.js';
import { handleChat } from './chat.js';
import { activities, simplifyDoitActivity } from './activities.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { v4 as uuidv4 } from 'uuid';

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession | null ): Promise<JSONRPCResponse | JSONRPCError> {
    const { name } = request.params || {};

    console.log('🔍 handleToolsCall', name, request, session);
    
    switch (name) {
        case 'read':
            return await handleRead(request);
        case 'update':
            return await handleUpdate(request,session);
        case 'query':
            return await handleQuery(request,activities);
        case 'recent-updates':
            return await handleRecentUpdates(request);
        case 'chat':
            return await handleChat(request);
        case 'delete':
            return await handleDelete(request,session);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

async function handleRead(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const { id } = request.params?.arguments as { id: string } || {};

    const activity = activities.find((activity: any) => activity.id === id) ?? null;

    return mcpResultResponse(request.id!, {
        activity
    });
}

async function handleDelete(request: JSONRPCRequest, session: ClientAgentSession | null): Promise<JSONRPCResponse | JSONRPCError> {
    if( !session )
        return jrpcErrorAuthRequired( request.id! );
    
    const { id } = request.params?.arguments as { id: string } || {};

    const index = activities.findIndex((e: any) => e.id === id);
    if ( index !== -1 )
        activities.splice(index, 1);

    return mcpResultResponse(request.id!, { success: index !== -1 });
}

async function handleUpdate(request: JSONRPCRequest, session: ClientAgentSession | null): Promise<JSONRPCResponse | JSONRPCError> {
    if( !session )
        return jrpcErrorAuthRequired( request.id! );
    
    let { activity } = request.params?.arguments as { activity: any } || {};

    if( activity.kind === 'doit-activity' ) {
        activity = simplifyDoitActivity(activity);  // convert to odi-activity kind
    //} else if( activity.kind === 'teamkinetic-activity' ) {
    //    activity = simplifyTeamKineticActivity(activity);  // convert to odi-activity kind
    } else if( activity.kind !== 'odi-activity' ) {
        return jrpcError(request.id!, -32602, `Invalid activity kind: ${activity.kind}`);
    }

    if( !activity.source )
        activity.source = { id: uuidv4() };
    activity.source.author = session.agentDid;  // URI, e.g. mailto:mike@example.com or did:web:example.com:mike

    const index = activities.findIndex((e: any) => e.id === activity.id);
    if ( index === -1 )
        activities.push(activity);
    else
        activities[index] = activity;

    return mcpResultResponse(request.id!, { updated: index, inserted: index === -1, source: activity.source });
}

let sortedByUpdatedAt: any[] | null = null;

async function handleRecentUpdates(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const { since, limit = 10 } = request.params?.arguments as { since: string, limit: number } || {};

    let results: any[] = [];
    if( since ) {
        // activities updated since a given time
        const sinceMillis = asMillis(since);
        results = activities.filter((activity: any) => asMillis(activity.updatedAt) > sinceMillis);
    } else {
        // Most recent activities up to a limit (default 10)
        let sorted = sortedByUpdatedAt;
        if( !sorted ) {
            sorted = activities.sort((a: any, b: any) => asMillis(b.updatedAt) - asMillis(a.updatedAt));
            sortedByUpdatedAt = sorted;
        }
        results = sorted.slice(0, limit)
    }

    // remove index
    results = results.map(({ index, ...etc }: any) => etc);

    return mcpResultResponse(request.id!, {
        kind: 'activity-list',
        activities: results
    });
}

function asMillis(date: string): number {
    return new Date(date).getTime();
}
