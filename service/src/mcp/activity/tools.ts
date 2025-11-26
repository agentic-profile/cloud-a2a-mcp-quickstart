const CoreActivitySchema = {
    type: 'object',
    properties: {
        kind: {
            type: 'string',
            enum: ['odi-activity'],
            description: 'The type of activity'
        },
        source: {
            type: 'object',
            description: 'Source information for the activity',
            properties: {
                kind: {
                    type: 'string',
                    enum: ['teamkinetic-activity', 'doit-activity'],
                    description: 'The source type'
                },
                author: {
                    type: 'string',
                    description: 'URI of the author (e.g. mailto:mike@example.com or did:web:example.com:mike)'
                },
                id: {
                    type: 'string',
                    description: 'Author scoped or global id'
                }
            },
            required: ['kind', 'author', 'id']
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the activity was created'
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the activity was last updated'
        },
        id: {
            type: 'string',
            description: 'The unique identifier of the activity'
        },
        activity: {
            type: 'string',
            description: 'The activity ID'
        },
        title: {
            type: 'string',
            description: 'The title of the activity'
        },
        description: {
            type: 'string',
            description: 'Description of the activity'
        },
        locationOption: {
            type: 'string',
            description: 'Location option for the activity'
        },
        cause: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of causes this activity supports'
        },
        type: {
            type: 'string',
            description: 'Type of activity'
        },
        start: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 date-time when the activity starts'
        },
        end: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 date-time when the activity ends'
        },
        address: {
            type: 'string',
            description: 'Physical address of the activity'
        },
        postcode: {
            type: 'string',
            description: 'Postal code of the activity location'
        },
        latitude: {
            type: 'number',
            description: 'Latitude coordinate of the activity location'
        },
        longitude: {
            type: 'number',
            description: 'Longitude coordinate of the activity location'
        },
        externalApplyLink: {
            type: 'string',
            format: 'uri',
            description: 'URL of web page to apply for the activity'
        }
    },
    required: ['kind', 'id', 'activity']
};

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
        },
        outputSchema: CoreActivitySchema
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
        },
        outputSchema: {
            type: 'object',
            properties: {
                activities: {
                    type: 'array',
                    items: CoreActivitySchema,
                    description: 'List of activities matching the query'
                }
            },
            required: ['activities']
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
                    items: CoreActivitySchema,
                    description: 'List of activities that have been updated since the given time'
                }
            },
            required: ['activities']
        }
    },
    {
        name: 'chat',
        description: 'Chat with an assistant to help build a filter for finding activities. The assistant asks questions to understand your criteria and returns both conversational responses and JSON filter objects.',
        inputSchema: {
            type: 'object',
            properties: {
                messages: {
                    type: 'array',
                    description: 'Array of messages in the conversation',
                    items: {
                        type: 'object',
                        properties: {
                            role: {
                                type: 'string',
                                enum: ['user', 'assistant'],
                                description: 'The role of the message sender'
                            },
                            content: {
                                type: 'string',
                                description: 'The content of the message'
                            }
                        },
                        required: ['role', 'content']
                    }
                }
            },
            required: ['messages']
        }
    }
];
