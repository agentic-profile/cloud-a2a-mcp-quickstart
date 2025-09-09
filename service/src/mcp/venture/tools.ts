export const MCP_TOOLS = [
    {
        name: 'update',
        description: 'Update venture profile',
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
                    description: 'Type of venture (e.g., startup, business, project, initiative)'
                },
                location: {
                    type: 'object',
                }
            },
            required: ['name']
        }
    },
    {
        name: 'query',
        description: 'List all venture profiles',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];
