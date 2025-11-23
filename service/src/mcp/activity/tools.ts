export const MCP_TOOLS = [
    {
        name: 'read',
        description: 'Read details about an activity a person could do',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'The id of the activity to read'
                }
            },
            required: ['id']
        }
    },
    {
        name: 'update',
        description: 'Update details about an activity a person could do',
        inputSchema: {
            type: 'object',
            properties: {
                activity: {
                    type: 'object',
                    description: 'The activity data to update'
                }
            },
            required: ['activity']
        }
    },
    {
        name: 'delete',
        description: 'Delete an activity a person could do',
        inputSchema: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'The id of the activity to delete'
                }
            },
            required: ['id']
        }
    },
    {
        name: 'query',
        description: 'Search for activities that match a specific query',
        inputSchema: {
            type: 'object',
            properties: {
                postalcode: {
                    type: 'string',
                    description: 'The postal code to search for activities in'
                }
            },
            required: []
        }
    },
    {
        name: 'recent-updates',
        description: 'Get activities that have been updated since a specific time',
        inputSchema: {
            type: 'object',
            properties: {
                since: {
                    type: 'string',
                    format: 'date-time',
                    description: 'ISO timestamp to get updates that have happened since this time'
                }
            },
            required: ['since']
        },
        outputSchema: {
            type: 'object',
            properties: {
                activities: {
                    type: 'array',
                    description: 'List of activities that have happened since the given time'
                }
            },
            required: ['activities']
        }
    }
];
