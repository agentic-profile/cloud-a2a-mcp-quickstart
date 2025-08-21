import { JsonRPCRequest, JsonRPCResponse } from '../../types';
import { storeValue, getValue } from '../../cache/redis';
import { rpcResult, rpcError, rpcContent } from '../../rpc/util';

export async function handleInitialize(request: JsonRPCRequest): Promise<JsonRPCResponse> {
    return rpcResult(request.id, {
        protocolVersion: '2024-11-05',
        capabilities: {
            tools: {}
        },
        serverInfo: {
            name: 'agentic-profile-mcp',
            version: '1.0.0'
        }
    });
}

export async function handleToolsList(request: JsonRPCRequest): Promise<JsonRPCResponse> {
    return rpcResult(request.id, {
        tools: [
                {
                    name: 'get_profile',
                    description: 'Get an agentic profile by DID',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            did: {
                                type: 'string',
                                description: 'The DID of the profile to retrieve'
                            }
                        },
                        required: ['did']
                    }
                },
                {
                    name: 'update_profile',
                    description: 'Update an agentic profile',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            did: {
                                type: 'string',
                                description: 'The DID of the profile to update'
                            },
                            profile: {
                                type: 'object',
                                description: 'The profile data to update'
                            }
                        },
                        required: ['did', 'profile']
                    }
                },
                {
                    name: 'location/update',
                    description: 'Update location coordinates for a user',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            coords: {
                                type: 'object',
                                properties: {
                                    latitude: {
                                        type: 'number',
                                        description: 'Latitude coordinate'
                                    },
                                    longitude: {
                                        type: 'number',
                                        description: 'Longitude coordinate'
                                    }
                                },
                                required: ['latitude', 'longitude']
                            }
                        },
                        required: ['coords']
                    }
                },
                {
                    name: 'location/query',
                    description: 'Get location coordinates for a user',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                }
            ]
        });
}

export async function handleToolsCall(request: JsonRPCRequest): Promise<JsonRPCResponse> {
    const { name, arguments: args } = request.params || {};
    
    switch (name) {
        case 'get_profile':
            return await handleGetProfile(request, args);
        case 'update_profile':
            return await handleUpdateProfile(request, args);
        case 'location/update':
            return await handleLocationUpdate(request, args);
        case 'location/query':
            return await handleLocationQuery(request);
        default:
            return rpcError(request.id, -32601, 'Tool not found');
    }
}

async function handleGetProfile(request: JsonRPCRequest, args: any): Promise<JsonRPCResponse> {
    const { did } = args;
    
    if (!did) {
        return rpcError(request.id, -32602, 'Invalid params: did is required');
    }

    // Mock profile data - in a real implementation, this would fetch from a database
    const profile = {
        did,
        name: 'Agent Profile',
        description: 'An agentic profile',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };

        return rpcContent(request.id, profile);
}

async function handleUpdateProfile(request: JsonRPCRequest, args: any): Promise<JsonRPCResponse> {
    const { did, profile } = args;
    
    if (!did || !profile) {
        return rpcError(request.id, -32602, 'Invalid params: did and profile are required');
    }

    // Mock update - in a real implementation, this would update a database
    const updatedProfile = {
        ...profile,
        did,
        updated: new Date().toISOString()
    };

    return rpcContent(request.id, `Profile updated successfully: ${JSON.stringify(updatedProfile, null, 2)}`);
} 

export async function handleLocationUpdate(request: JsonRPCRequest, args: any): Promise<JsonRPCResponse> {
    const { coords } = args;
    
    if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
        return rpcError(request.id, -32602, 'Invalid params: coords with latitude and longitude are required');
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
        return rpcContent(request.id, `Location updated successfully: ${JSON.stringify(locationData, null, 2)}`);
    } catch (error) {
        console.log('🔍 storeValue failed, using fallback:', error);
        return rpcError(request.id, -32603, 'Failed to store location data:' + (error as Error).message);
    }
}

export async function handleLocationQuery(request: JsonRPCRequest): Promise<JsonRPCResponse> {
    const userDid = "did:web:iamagentic.ai:1";
    const locationKey = `location:${userDid}`;
    
    try {
        const locationData = await getValue(locationKey);
        
        if (!locationData) {
            return rpcError(request.id, -32604, 'No location data found for user');
        }

        return rpcContent(request.id, `Location data: ${JSON.stringify(locationData, null, 2)}`);
    } catch (error) {
        console.log('🔍 getValue failed, using fallback:', error);
        
        // Return a fallback response when Redis is unavailable
        return rpcContent(request.id, 'Location data unavailable (Redis connection issue)');
    }
} 