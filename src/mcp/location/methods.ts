import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { storeValue, getValue } from '../../cache/redis';
import { jrpcResult, jrpcError } from '../../json-rpc';
import { mcpTextContentResponse } from '../utils';
import { MCP_TOOLS } from './tools';

export async function handleToolsList(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    return jrpcResult(request.id!, { tools: MCP_TOOLS } ) as JSONRPCResponse;
}

export async function handleToolsCall(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const { name, arguments: args } = request.params || {};
    
    switch (name) {
        case 'update':
            return await handleLocationUpdate(request, args);
        case 'query':
            return await handleLocationQuery(request);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

export async function handleLocationUpdate(request: JSONRPCRequest, args: any): Promise<JSONRPCResponse | JSONRPCError> {
    const { coords } = args;
    
    if (!coords) {
        return jrpcError(request.id!, -32602, 'Invalid params: coords with latitude and longitude are required');
    }
    const { latitude, longitude } = coords;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return jrpcError(request.id!, -32602, 'Invalid params: both latitude and longitude must be provided and as numbers');
    }

    const userDid = "did:web:iamagentic.ai:1";
    const locationKey = `location:${userDid}`;
    
    const locationData = {
        latitude,
        longitude,
        updated: new Date().toISOString()
    };

    console.log('🔍 About to call storeValue...');

    try {
        await storeValue(locationKey, locationData);
        console.log('🔍 storeValue completed');
        return mcpTextContentResponse(request.id!, `Location updated successfully: ${longitude}, ${latitude}`);
    } catch (error) {
        console.log('🔍 storeValue failed for location:', error);
                    return jrpcError(request.id!, -32603, 'Failed to store location data:' + (error as Error).message);
    }
}

export async function handleLocationQuery(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const userDid = "did:web:iamagentic.ai:1";
    const locationKey = `location:${userDid}`;
    
    try {
        const locationData = await getValue(locationKey);
        
        if (!locationData) {
            return jrpcError(request.id!, -32604, 'No location data found for user');
        }

        const { longitude, latitude } = locationData;
        return mcpTextContentResponse(request.id!, `Location: ${longitude}, ${latitude}`);
    } catch (error) {
        console.log('🔍 getValue failed, using fallback:', error);
        return jrpcError(request.id!, -32603, 'Location data unavailable (Redis connection issue)');
    }
}
