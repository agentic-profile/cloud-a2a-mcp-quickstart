const VolunteerSchema = {
    type: 'object',
    properties: {
        did: {
            type: 'string',
            description: 'DID of the volunteer'
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the volunteer was created'
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'ISO 8601 timestamp when the volunteer was last updated'
        },
        name: {
            type: 'string',
            description: 'Name of the volunteer'
        },
        description: {
            type: 'string',
            description: 'Description of the volunteer'
        },
        skills: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['gardening', 'animal_care', 'event_organisation', 'marketing', 'fundraising', 'administration']
            },
            description: 'List of skills the volunteer has'
        },
        preferences: {
            type: 'object',
            description: 'Volunteer preferences',
            properties: {
                times: {
                    type: 'object',
                    description: 'Time preferences',
                    properties: {
                        hours: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['morning', 'afternoon', 'evening']
                            },
                            description: 'Preferred times of day'
                        },
                        days: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                            },
                            description: 'Preferred days of week'
                        },
                        durationHours: {
                            type: 'number',
                            description: 'Preferred duration in hours'
                        }
                    }
                },
                dates: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            startDate: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Start date of availability'
                            },
                            endDate: {
                                type: 'string',
                                format: 'date-time',
                                description: 'End date of availability'
                            }
                        },
                        required: ['startDate', 'endDate']
                    },
                    description: 'Date ranges when the volunteer is available'
                },
                maxDistanceKm: {
                    type: 'number',
                    description: 'Maximum distance in kilometers the volunteer is willing to travel'
                }
            }
        },
        postcode: {
            type: 'string',
            description: 'Postal code of the volunteer'
        }
    },
    required: ['did', 'createdAt', 'updatedAt', 'name']
};

const UpdateVolunteerSchema = {
    ...VolunteerSchema,
    required: ['did']
}

export const MCP_TOOLS = [
    {
        name: 'read',
        description: 'Read details about a volunteer',
        inputSchema: {
            type: 'object',
            properties: {
                did: {
                    type: 'string',
                    description: 'The id of the volunteer to read'
                }
            },
            required: ['did']
        },
        outputSchema: VolunteerSchema
    },
    {
        name: 'update',
        description: 'Update details about a volunteer',
        inputSchema: UpdateVolunteerSchema
    },
    {
        name: 'delete',
        description: 'Delete a volunteer',
        inputSchema: {
            type: 'object',
            properties: {
                did: {
                    type: 'string',
                    description: 'The DID of the volunteer to delete'
                }
            },
            required: ['did']
        }
    },
    {
        name: 'query',
        description: 'Search for volunteers that match a specific query',
        inputSchema: {
            type: 'object',
            properties: {
                postcode: {
                    type: 'string',
                    description: 'The postal code to search for volunteers in'
                },
                distance: {
                    type: 'number',
                    description: 'Distance in kilometers to search for volunteers within (requires geolocation)'
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
                }
            },
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                volunteers: {
                    type: 'array',
                    items: VolunteerSchema,
                    description: 'List of volunteers matching the query'
                }
            },
            required: ['volunteers']
        }
    },
    {
        name: 'recent-updates',
        description: 'Get volunteers that have been updated since a specific time',
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
                    description: 'Maximum number of volunteers to return (default 10)'
                }
            },
            required: ['since']
        },
        outputSchema: {
            type: 'object',
            properties: {
                volunteers: {
                    type: 'array',
                    items: VolunteerSchema,
                    description: 'List of volunteers that have been updated since the given time'
                }
            },
            required: ['volunteers']
        }
    }
];
