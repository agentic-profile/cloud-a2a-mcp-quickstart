export const MCP_TOOLS = [
    {
        name: 'update',
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
        name: 'query',
        description: 'Get location coordinates for a user',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];
