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
                postcode: {
                    type: 'string',
                    description: 'The postal code to search for activities in'
                },
                distance: {
                    type: 'number',
                    description: 'Distance in kilometers to search for activities within (requires geolocation)'
                },
                geolocation: {
                    type: 'object',
                    description: 'Geographic coordinates to search around',
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
                },
                attendanceType: {
                    type: 'string',
                    enum: ['Home', 'Local'],
                    description: 'Filter activities by attendance type (Home for remote, Local for in-person)'
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
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of activities to return (default 10)'
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
