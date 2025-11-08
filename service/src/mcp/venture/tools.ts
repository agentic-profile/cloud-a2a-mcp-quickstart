export const MCP_TOOLS = [
    {
        name: 'query',
        description: 'Read all venture profiles of a specific kind',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['venture', 'capital'],
                    description: 'The kind of venture profile to read'
                }
            },
            required: ['kind']
        },
        outputSchema: {
            type: 'object',
            properties: {
                profiles: {
                    type: 'array',
                    description: 'List of venture profiles matching the requested kind',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'Unique identifier for the profile'
                            },
                            kind: {
                                type: 'string',
                                enum: ['venture', 'capital', 'venture-strategy'],
                                description: 'The kind of profile'
                            },
                            updated: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Timestamp when the profile was last updated'
                            }
                        },
                        additionalProperties: true
                    }
                }
            },
            required: ['profiles']
        }
    },
    {
        name: 'read',
        description: 'Read venture profile of a specific kind and owned by the authenticating agent',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['venture', 'capital'],
                    description: 'The kind of venture profile to read'
                }
            },
            required: ['kind']
        }
    },
    {
        name: 'update',
        description: 'Update venture profile',
        inputSchema: {
            type: 'object',
            properties: {
                profile: {
                    type: 'object',
                    description: 'The profile data to update'
                }
            },
            required: ['profile']
        }
    },
    {
        name: 'delete',
        description: 'Delete venture profile of a specific kind and owned by the authenticating agent',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['venture', 'capital'],
                    description: 'The kind of venture profile to delete'
                }
            },
            required: ['kind']
        }
    },
    {
        name: 'about',
        description: 'Get information about all venture profiles for a specific DID',
        inputSchema: {
            type: 'object',
            properties: {
                did: {
                    type: 'string',
                    description: 'The DID to get venture profiles for'
                }
            },
            required: ['did']
        }
    },
    {
        name: 'recent-updates',
        description: 'Get recent updates for a specific kind of venture profile',
        inputSchema: {
            type: 'object',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['venture', 'capital'],
                    description: 'The kind of venture profile to get recent updates for'
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
