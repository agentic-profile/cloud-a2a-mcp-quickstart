import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { ventureProfileStore } from '../../stores/dynamodb-store.js';
import { jrpcError } from '../../json-rpc/index.js';
import { mcpResultResponse, mcpTextContentResponse } from '../utils.js';

import { ClientAgentSession } from '@agentic-profile/auth';
import { VentureProfile } from '../../stores/types.js';

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { name } = request.params || {};

    console.log('🔍 handleToolsCall', name, session);
    
    switch (name) {
        case 'update':
            return await handleUpdate(request,session);
        case 'query':
            return await handleQuery(request);
        case 'list-all':
            return await handleListAll(request);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

export async function handleUpdate(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const profile = request.params?.profile as VentureProfile | undefined;
    
    if (!profile) {
        return jrpcError(request.id!, -32602, 'Invalid params: profile is required');
    }

    // I can only upload my own profile
    profile.did = session.agentDid

    try {
        await ventureProfileStore.saveVentureProfile(profile);
        return mcpTextContentResponse(request.id!, `Venture profile updated successfully`);
    } catch (error) {
        return jrpcError(request.id!, -32603, 'Failed to save venture profile:' + (error as Error).message);
    }
}

export async function handleQuery(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {    
    try {
        const profiles = await ventureProfileStore.queryVentureProfiles();
        return mcpResultResponse(request.id!, { profiles });
    } catch (error) {
        console.log('🔍 getValue failed, using fallback:', error);
        return jrpcError(request.id!, -32603, 'Failed to query venture profiles: ' + (error as Error).message);
    }
}

export async function handleListAll(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {    
    try {
        const allItems = await ventureProfileStore.listAllItems();
        return mcpResultResponse(request.id!, { items: allItems, count: allItems.length });
    } catch (error) {
        console.log('🔍 listAll failed:', error);
        return jrpcError(request.id!, -32603, 'Failed to list all items: ' + (error as Error).message);
    }
}
