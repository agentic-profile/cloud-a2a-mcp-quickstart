export const MCP_TOOLS = [
    {
        name: 'update',
        description: 'Create or update a wallet item with credentials',
        inputSchema: {
            type: 'object',
            properties: {
                item: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'Unique identifier for the wallet item'
                        },
                        credential: {
                            type: 'object',
                            description: 'Credential data (JSON object)'
                        }
                    },
                    required: ['key', 'credential']
                }
            },
            required: ['item']
        }
    },
    {
        name: 'read',
        description: 'Retrieve a wallet item by key',
        inputSchema: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'Key of the wallet item to retrieve'
                }
            },
            required: ['key']
        }
    },
    {
        name: 'delete',
        description: 'Delete a wallet item by key',
        inputSchema: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'Key of the wallet item to delete'
                }
            },
            required: ['key']
        }
    },
    {
        name: 'present',
        description: 'Present a credential from the wallet by key',
        inputSchema: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'Key of the wallet item to present'
                }
            },
            required: ['key']
        }
    },
    {
        name: 'list',
        description: 'List all wallet items owned by the current user',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    }
];
