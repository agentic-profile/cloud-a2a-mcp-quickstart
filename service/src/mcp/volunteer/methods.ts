import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { jrpcError, jrpcErrorAuthRequired } from '../../json-rpc/index.js';
import { mcpResultResponse } from '../misc.js';
import { handleQuery } from './query.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { Volunteer } from './types.js';
import { bulkDeleteVolunteers, deleteVolunteer, queryVolunteers, readVolunteer, updateVolunteer } from './graphdb/neptune.js';
import { parseDid } from '../../utils/did.js';
import { createRandomVolunteer } from './synthesize.js';

const ADMIN_DID = process.env.ADMIN_DID || 'did:web:iamagentic.ai:1';

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
        case 'bulk-delete':
            return await handleBulkDelete(request,session);
        case 'bulk-create':
            return await handleBulkCreate(request,session);

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
    if( parseDid(session.agentDid).did !== did )
        return jrpcError(request.id!, -32603, `You are not authorized to delete this volunteer`);

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
    volunteer.did = parseDid(session.agentDid).did;
    volunteer.updatedAt = new Date().toISOString();

    try {
        await updateVolunteer(volunteer);
        return mcpResultResponse(request.id!, { success: true });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to update volunteer: ${error}`);
    }
}

async function handleBulkCreate(request: JSONRPCRequest, session: ClientAgentSession | null): Promise<JSONRPCResponse | JSONRPCError> {
    if( !session )
        return jrpcErrorAuthRequired( request.id! );
    if( parseDid(session.agentDid).did !== ADMIN_DID )
        return jrpcError(request.id!, -32603, `You are not authorized to bulk delete volunteers`);

    let { limit = 100, fieldOptionality = 0.5 } = request.params?.arguments as { limit?: number, fieldOptionality?: number } || {};
    const deadline = Date.now() + 10000;

    try {
        let count = 0;
        while( count < limit && Date.now() < deadline ) {
            await updateVolunteer( createRandomVolunteer(fieldOptionality) );
            ++count;
        }
        return mcpResultResponse(request.id!, { count });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to update volunteer: ${error}`);
    }
}

async function handleBulkDelete(request: JSONRPCRequest, session: ClientAgentSession | null): Promise<JSONRPCResponse | JSONRPCError> {
    if( !session )
        return jrpcErrorAuthRequired( request.id! );
    if( parseDid(session.agentDid).did !== ADMIN_DID )
        return jrpcError(request.id!, -32603, `You are not authorized to bulk delete volunteers`);

    let { limit = 20 } = request.params?.arguments as { limit: number } || {};

    try {
        await bulkDeleteVolunteers(limit);
        return mcpResultResponse(request.id!, { success: true });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to bulk delete volunteers: ${error}`);
    }
}

async function handleRecentUpdates(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    //const { since, limit = 10 } = request.params?.arguments as { since: string, limit: number } || {};
    try {
        const volunteers = await queryVolunteers();
        return mcpResultResponse(request.id!, {
            kind: 'volunteer-list',
            volunteers
        });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to list volunteers: ${error}`);
    }
}
