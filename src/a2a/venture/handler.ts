import { JsonRPCRequest, JsonRPCResponse } from '../../types';

// Venture data store (in a real implementation, this would be a database)
const ventures = new Map<string, any>();
let ventureCounter = 1;

// Simple venture operations
export const ventureOperations = {
    createVenture: async (data: any) => {
        const ventureId = `venture_${ventureCounter++}`;
        const venture = {
            id: ventureId,
            name: data.name,
            description: data.description || '',
            type: data.type || 'startup',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        ventures.set(ventureId, venture);
        return venture;
    },

    listVentures: async () => {
        return Array.from(ventures.values());
    },

    getVenture: async (id: string) => {
        const venture = ventures.get(id);
        if (!venture) {
            throw new Error(`Venture not found: ${id}`);
        }
        return venture;
    },

    updateVenture: async (id: string, updates: any) => {
        const venture = ventures.get(id);
        if (!venture) {
            throw new Error(`Venture not found: ${id}`);
        }
        
        const updatedVenture = {
            ...venture,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        ventures.set(id, updatedVenture);
        return updatedVenture;
    },

    deleteVenture: async (id: string) => {
        const venture = ventures.get(id);
        if (!venture) {
            throw new Error(`Venture not found: ${id}`);
        }
        
        ventures.delete(id);
        return { deletedId: id, message: 'Venture deleted successfully' };
    }
};

// A2A JSON-RPC message handler
export async function handleVentureJsonRPC(request: JsonRPCRequest): Promise<JsonRPCResponse> {
    console.log('🚀 Processing venture JSON-RPC request:', request);
    
    try {
        const { method, params } = request;
        
        switch (method) {
            case 'initialize':
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        name: 'venture-service',
                        version: '1.0.0',
                        capabilities: {
                            venture: {
                                supported: true,
                                features: ['venture-creation', 'venture-management', 'venture-analytics']
                            }
                        }
                    }
                };
            
            case 'tools/list':
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        tools: [
                            {
                                name: 'venture_create',
                                description: 'Create a new venture with the specified details',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            description: 'Name of the venture'
                                        },
                                        description: {
                                            type: 'string',
                                            description: 'Description of the venture'
                                        },
                                        type: {
                                            type: 'string',
                                            description: 'Type of venture (e.g., startup, business, project)',
                                            enum: ['startup', 'business', 'project', 'initiative']
                                        }
                                    },
                                    required: ['name']
                                }
                            },
                            {
                                name: 'venture_list',
                                description: 'List all available ventures',
                                inputSchema: {
                                    type: 'object',
                                    properties: {}
                                }
                            },
                            {
                                name: 'venture_get',
                                description: 'Get detailed information about a specific venture',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                            description: 'ID of the venture to retrieve'
                                        }
                                    },
                                    required: ['id']
                                }
                            },
                            {
                                name: 'venture_update',
                                description: 'Update an existing venture with new information',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                            description: 'ID of the venture to update'
                                        },
                                        updates: {
                                            type: 'object',
                                            description: 'Object containing the fields to update'
                                        }
                                    },
                                    required: ['id', 'updates']
                                }
                            },
                            {
                                name: 'venture_delete',
                                description: 'Delete a venture permanently',
                                inputSchema: {
                                    type: 'object',
                                    properties: {
                                        id: {
                                            type: 'string',
                                            description: 'ID of the venture to delete'
                                        }
                                    },
                                    required: ['id']
                                }
                            }
                        ]
                    }
                };
            
            case 'tools/call':
                const { name, arguments: args } = params || {};
                
                if (!name) {
                    return {
                        jsonrpc: '2.0',
                        id: request.id,
                        error: {
                            code: -32602,
                            message: 'Tool name is required'
                        }
                    };
                }
                
                // Route tool calls to appropriate handlers
                switch (name) {
                    case 'venture_create':
                        const createdVenture = await ventureOperations.createVenture(args);
                        return {
                            jsonrpc: '2.0',
                            id: request.id,
                            result: {
                                type: 'venture_created',
                                venture: createdVenture,
                                message: 'Venture created successfully'
                            }
                        };
                    
                    case 'venture_list':
                        const venturesList = await ventureOperations.listVentures();
                        return {
                            jsonrpc: '2.0',
                            id: request.id,
                            result: {
                                type: 'ventures_listed',
                                ventures: venturesList,
                                count: venturesList.length,
                                message: 'Ventures retrieved successfully'
                            }
                        };
                    
                    case 'venture_get':
                        const venture = await ventureOperations.getVenture(args.id);
                        return {
                            jsonrpc: '2.0',
                            id: request.id,
                            result: {
                                type: 'venture_retrieved',
                                venture,
                                message: 'Venture retrieved successfully'
                            }
                        };
                    
                    case 'venture_update':
                        const updatedVenture = await ventureOperations.updateVenture(args.id, args.updates);
                        return {
                            jsonrpc: '2.0',
                            id: request.id,
                            result: {
                                type: 'venture_updated',
                                venture: updatedVenture,
                                message: 'Venture updated successfully'
                            }
                        };
                    
                    case 'venture_delete':
                        const deleteResult = await ventureOperations.deleteVenture(args.id);
                        return {
                            jsonrpc: '2.0',
                            id: request.id,
                            result: {
                                type: 'venture_deleted',
                                result: deleteResult,
                                message: 'Venture deleted successfully'
                            }
                        };
                    
                    default:
                        return {
                            jsonrpc: '2.0',
                            id: request.id,
                            error: {
                                code: -32601,
                                message: `Unknown tool: ${name}`
                            }
                        };
                }
            
            default:
                return {
                    jsonrpc: '2.0',
                    id: request.id,
                    error: {
                        code: -32601,
                        message: `Method not supported: ${method}`
                    }
                };
        }
    } catch (error) {
        console.error('Error processing venture JSON-RPC request:', error);
        return {
            jsonrpc: '2.0',
            id: request.id,
            error: {
                code: -32603,
                message: 'Internal error processing venture request',
                data: error instanceof Error ? error.message : 'Unknown error'
            }
        };
    }
}
