export const MCP_TOOLS = [
    {
        name: 'read',
        description: 'Read a community profile',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['volunteer', 'charity', 'club', 'facility', 'provider'],
                    description: 'The kind of community profile to read'
                }
            },
            required: ['kind']
        }
    },
    {
        name: 'update',
        description: 'Update a community profile',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['volunteer', 'charity', 'club', 'facility', 'provider'],
                    description: 'The kind of community profile to update'
                },
                profile: {
                    type: 'object',
                    description: 'The profile data to update'
                }
            },
            required: ['kind', 'profile']
        }
    },
    {
        name: 'delete',
        description: 'Delete a community profile',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['volunteer', 'charity', 'club', 'facility', 'provider'],
                    description: 'The kind of community profile to delete'
                }
            },
            required: ['kind']
        }
    },
    {
        name: 'about',
        description: 'Get information about all community profiles for a specific DID',
        inputSchema: {
            type: 'object',
            properties: {
                did: {
                    type: 'string',
                    description: 'The DID to get community profiles for'
                }
            },
            required: ['did']
        }
    },
    {
        name: 'recent-updates',
        description: 'Get recent updates for a specific kind of community profile',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['volunteer', 'charity', 'club', 'facility', 'provider'],
                    description: 'The kind of community profile to get recent updates for'
                },
                since: {
                    type: 'string',
                    format: 'date-time',
                    description: 'ISO timestamp to get updates since (defaults to 24 hours ago)'
                }
            },
            required: ['kind']
        }
    }
];
