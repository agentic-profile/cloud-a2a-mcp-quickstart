import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { jrpcError, jrpcErrorAuthRequired } from '../../json-rpc/index.js';
import { /*mcpContentResponse, mcpContentResponse,*/ mcpResultResponse } from '../misc.js';
import { handleQuery } from './query.js';

import activityData from './activities.json' with { type: 'json' };
const activities = simplifyActivities(activityData);
console.log('🔍 activities', activities.length );

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
        kind: 'activity',
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
    
    const { activity } = request.params?.arguments as { activity: any } || {};
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

    return mcpResultResponse(request.id!, {
        kind: 'activity-list',
        activities: results
    });
}

function asMillis(date: string): number {
    return new Date(date).getTime();
}

//
// Convert MongoDB objects to simpler objects for the MCP
//

function simplifyActivities(activities: any[]): any[] {
    return activities.map(simplifyActivity);
}

function simplifyActivity(activity: any): any {
    const result = simplifyObject(activity);
    result.postcode = resolvePostcodeFromActivity(activity);
    return result;
}

function simplifyObject(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    // If it's an object with a $oid property, replace with the value
    if (typeof obj === 'object' && !Array.isArray(obj) && obj.$oid !== undefined) {
        return obj.$oid;
    }
    
    // If it's an object with a $date property, replace with the value
    if (typeof obj === 'object' && !Array.isArray(obj) && obj.$date !== undefined) {
        return obj.$date;
    }
    
    // If it's an array, recursively process each element
    if (Array.isArray(obj)) {
        return obj.map(item => simplifyObject(item));
    }
    
    // If it's a plain object, recursively process all properties
    if (typeof obj === 'object') {
        const simplified: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Rename _id to id
                const newKey = key === '_id' ? 'id' : key;
                simplified[newKey] = simplifyObject(obj[key]);
            }
        }
        return simplified;
    }
    
    // For primitives, return as-is
    return obj;
}

function resolvePostcodeFromActivity( activity: any ): string | undefined {
    let postcode = resolvePostcodeFromStreet( activity.address?.street );
    if( !postcode )
        postcode = resolvePostcodeFromStreet( activity.organizationSubDocument?.fullAddress?.street );

    //if( postcode )
    //    console.log('🔍 postcode', postcode, activity.id );
    return postcode;
}

function resolvePostcodeFromStreet( street: string ): string | undefined {
    // UK postcode pattern: 1-2 letters, 1-2 numbers, optional space, 1 number, 2 letters
    // Examples: E1 3DG, SW2 1RW, EX32 7EU, CO1 2SL, B3 1DG, NE63 9UJ
    const ukPostcodeRegex = /\b([A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2})\b/;
    const match = street?.match(ukPostcodeRegex);
    if( match )
        return match[1].trim();
    else
        return undefined;
}
