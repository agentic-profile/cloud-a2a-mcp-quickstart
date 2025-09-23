export const MCP_TOOLS = [
    {
        name: 'read',
        description: 'Read a reputation item I created by key',
        inputSchema: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'The key of the reputation item to read'
                }
            },
            required: ['key']
        }
    },
    {
        name: 'update',
        description: 'Create or update a reputation item',
        inputSchema: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'Unique key for the reputation item (per reporter)'
                },
                subjectDid: {
                    type: 'string',
                    description: 'DID of the subject this reputation is about'
                },
                kind: {
                    type: 'string',
                    description: 'Type of reputation (e.g., "review", "rating", "recommendation", "feedback")'
                },
                reputation: {
                    type: 'object',
                    description: 'The reputation data/content'
                }
            },
            required: ['key', 'subjectDid', 'kind', 'reputation']
        }
    },
    {
        name: 'delete',
        description: 'Delete a reputation item by ID',
        inputSchema: {
            type: 'object',
            properties: {
                key: {
                    type: 'string',
                    description: 'The key of the reputation item to delete'
                }
            },
            required: ['key']
        }
    },
    {
        name: 'list-by-reporter',
        description: 'List all reputation items that I have reported',
        inputSchema: {
            type: 'object',
            properties: {}
        }
    },
    {
        name: 'list-by-subject',
        description: 'List all reputation items about a specific subject',
        inputSchema: {
            type: 'object',
            properties: {
                subjectDid: {
                    type: 'string',
                    description: 'DID of the subject to get reputation items for'
                }
            },
            required: ['subjectDid']
        }
    }
];
