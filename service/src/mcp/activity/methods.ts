import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { jrpcError, jrpcErrorAuthRequired } from '../../json-rpc/index.js';
import { /*mcpContentResponse, mcpContentResponse,*/ mcpResultResponse } from '../misc.js';

import activityData from './activities.json' with { type: 'json' };
const activities = simplifyActivities(activityData);
console.log('🔍 activities', JSON.stringify(activities, null, 4));

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
            return await handleQuery(request);
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

async function handleQuery(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const { postalcode } = request.params?.arguments as { postalcode: string } || {};

    const results = activities.filter((activity: any) => activity.postalcode === postalcode);

    return mcpResultResponse(request.id!, {
        kind: 'activity-list',
        activities: results
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

async function handleRecentUpdates(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const { since } = request.params?.arguments as { since: string } || {};

    const sinceMillis = asMillis(since);

    const results = activities.filter((activity: any) => asMillis(activity.updatedAt) > sinceMillis);

    return mcpResultResponse(request.id!, {
        kind: 'activity-list',
        activities: results
    });
}

function asMillis(date: string): number {
    return new Date(date).getTime();
}

function simplifyActivities(activities: any[]): any[] {
    return activities.map(simplifyActivity);
}

function simplifyActivity(activity: any): any {
    return simplifyObject(activity);
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
