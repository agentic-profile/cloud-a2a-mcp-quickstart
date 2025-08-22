import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { storeValue, getValue } from '../../cache/redis';
import { rpcResult, rpcError } from '../../rpc';
import { rpcContent } from '../utils';
import { MCP_TOOLS } from './tools';

export async function handleToolsList(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    return rpcResult(request.id!, { tools: MCP_TOOLS } ) as JSONRPCResponse;
}

export async function handleToolsCall(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const { name, arguments: args } = request.params || {};
    
    switch (name) {
        case 'update':
            return await handleLocationUpdate(request, args);
        case 'query':
            return await handleLocationQuery(request);
        default:
            return rpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

export async function handleLocationUpdate(request: JSONRPCRequest, args: any): Promise<JSONRPCResponse | JSONRPCError> {
    const { coords } = args;
    
    if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
        return rpcError(request.id!, -32602, 'Invalid params: coords with latitude and longitude are required');
    }

    const userDid = "did:web:iamagentic.ai:1";
    const locationKey = `location:${userDid}`;
    
    const locationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        updated: new Date().toISOString()
    };

    console.log('🔍 About to call storeValue...');

    try {
        await storeValue(locationKey, locationData);
        console.log('🔍 storeValue completed');
        return rpcContent(request.id!, `Location updated successfully: ${JSON.stringify(locationData, null, 2)}`);
    } catch (error) {
        console.log('🔍 storeValue failed, using fallback:', error);
        return rpcError(request.id!, -32603, 'Failed to store location data:' + (error as Error).message);
    }
}

export async function handleLocationQuery(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const userDid = "did:web:iamagentic.ai:1";
    const locationKey = `location:${userDid}`;
    
    try {
        const locationData = await getValue(locationKey);
        
        if (!locationData) {
            return rpcError(request.id!, -32604, 'No location data found for user');
        }

        return rpcContent(request.id!, `Location data: ${JSON.stringify(locationData, null, 2)}`);
    } catch (error) {
        console.log('🔍 getValue failed, using fallback:', error);
        
        // Return a fallback response when Redis is unavailable
        return rpcContent(request.id!, 'Location data unavailable (Redis connection issue)');
    }
}
