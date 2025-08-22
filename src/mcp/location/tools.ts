export const MCP_TOOLS = [
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
];
