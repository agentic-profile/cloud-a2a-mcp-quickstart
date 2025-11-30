import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { jrpcError, jrpcErrorAuthRequired } from '../../json-rpc/index.js';
import { mcpResultResponse } from '../misc.js';
import { handleQuery } from './query.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { Volunteer } from './types.js';
import { deleteVolunteer, listVolunteers, readVolunteer, updateVolunteer } from './graphdb/neptune.js';

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
    const { did } = request.params?.arguments as { did: string } || {};

    try {
        const volunteer = await readVolunteer(did);
        return mcpResultResponse(request.id!, {
            volunteer
        });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to read volunteer: ${error}`);
    }
}

async function handleDelete(request: JSONRPCRequest, session: ClientAgentSession | null): Promise<JSONRPCResponse | JSONRPCError> {
    if( !session )
        return jrpcErrorAuthRequired( request.id! );
    
    const { did } = request.params?.arguments as { did: string } || {};

    try {
        await deleteVolunteer(did);
        return mcpResultResponse(request.id!, { success: true });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to delete volunteer: ${error}`);
    }
}

async function handleUpdate(request: JSONRPCRequest, session: ClientAgentSession | null): Promise<JSONRPCResponse | JSONRPCError> {
    if( !session )
        return jrpcErrorAuthRequired( request.id! );

    let { volunteer } = request.params?.arguments as { volunteer: Volunteer } || {};

    try {
        await updateVolunteer(volunteer);
        return mcpResultResponse(request.id!, { success: true });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to update volunteer: ${error}`);
    }
}

//let sortedByUpdatedAt: any[] | null = null;

async function handleRecentUpdates(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    //const { since, limit = 10 } = request.params?.arguments as { since: string, limit: number } || {};
    try {
        const volunteers = await listVolunteers();
        return mcpResultResponse(request.id!, {
            kind: 'volunteer-list',
            volunteers
        });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to list volunteers: ${error}`);
    }
}

/*
function asMillis(date: string): number {
    return new Date(date).getTime();
}*/
