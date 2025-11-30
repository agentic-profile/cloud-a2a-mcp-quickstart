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
                enum: [
                    'Business, Strategy & Legal',
                    'Communications, Marketing & Events',
                    'CPR/First Aid',
                    'Creative Services',
                    'Digital, Data & IT',
                    'Finance & Fundraising',
                    'Heavy Equipment Operator',
                    'Leadership & Management',
                    'Mechanic',
                    'Medical Doctor',
                    'Medical Nurse',
                    'Medical Paramedic',
                    'Organisational Policy & Governance',
                    'Property & Infrastructure',
                    'Radio Operator',
                    'Research, Service Design & User Insight',
                    'Search and Rescue',
                    'Support, Training & Advocacy',
                    'Sustainability & Energy'
                ]
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
                        maxDurationHours: {
                            type: 'number',
                            description: 'Maximum preferred duration in hours'
                        },
                        commitment: {
                            type: 'string',
                            enum: ['one time', 'weekly', 'monthly', 'flexible'],
                            description: 'Time commitment preference'
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
                },
                causes: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: [
                            'Animal welfare',
                            'Community',
                            'Crisis and Welfare',
                            'Emergency Response',
                            'Health and social care',
                            'Older people',
                            'Sports',
                            'Sports, art and culture',
                            'Sustainability, heritage and environment',
                            'Young People & Children'
                        ]
                    },
                    description: 'Causes the volunteer is interested in'
                },
                presence: {
                    type: 'array',
                    items: {
                        type: 'string',
                        enum: ['in-person', 'remote']
                    },
                    description: 'Preferred presence types'
                }
            }
        },
        postcode: {
            type: 'string',
            description: 'Postal code of the volunteer'
        },
        age: {
            type: 'number',
            description: 'Age of the volunteer'
        },
        minor: {
            type: 'boolean',
            description: 'Whether the volunteer is a minor'
        },
        gender: {
            type: 'string',
            enum: ['male', 'female'],
            description: 'Gender of the volunteer'
        },
        languages: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['en', 'fr', 'de', 'it', 'es', 'ru', 'zh', 'ja', 'ko', 'jp']
            },
            description: 'Languages spoken by the volunteer (ISO 639 codes)'
        },
        history: {
            type: 'object',
            description: 'Volunteering history of the volunteer',
            properties: {
                since: {
                    type: 'string',
                    format: 'date-time',
                    description: 'ISO 8601 timestamp when the volunteer started volunteering'
                },
                activities: {
                    type: 'number',
                    description: 'Number of activities the volunteer has participated in'
                },
                organizations: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'List of organizations that hosted the activities'
                }
            }
        }
    },
    required: ['did', 'createdAt', 'updatedAt', 'name']
};

const QueryVolunteersSchema = {
    type: 'object',
    properties: {
        keywords: {
            type: 'string',
            description: 'Keywords to search for in volunteer profiles'
        },
        postcode: {
            type: 'string',
            description: 'The postal code to search for volunteers in'
        },
        maxDistanceKm: {
            type: 'number',
            description: 'Maximum distance in kilometers to search for volunteers within'
        },
        hourPreferences: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['morning', 'afternoon', 'evening']
            },
            description: 'Preferred times of day'
        },
        dayPreferences: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
            },
            description: 'Preferred days of week'
        },
        minDurationHours: {
            type: 'number',
            description: 'Minimum duration in hours'
        },
        startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Start date for availability'
        },
        endDate: {
            type: 'string',
            format: 'date-time',
            description: 'End date for availability'
        },
        causes: {
            type: 'array',
            items: {
                type: 'string',
                enum: [
                    'Animal welfare',
                    'Community',
                    'Crisis and Welfare',
                    'Emergency Response',
                    'Health and social care',
                    'Older people',
                    'Sports',
                    'Sports, art and culture',
                    'Sustainability, heritage and environment',
                    'Young People & Children'
                ]
            },
            description: 'Causes to filter by'
        },
        skills: {
            type: 'array',
            items: {
                type: 'string',
                enum: [
                    'Business, Strategy & Legal',
                    'Communications, Marketing & Events',
                    'CPR/First Aid',
                    'Creative Services',
                    'Digital, Data & IT',
                    'Finance & Fundraising',
                    'Heavy Equipment Operator',
                    'Leadership & Management',
                    'Mechanic',
                    'Medical Doctor',
                    'Medical Nurse',
                    'Medical Paramedic',
                    'Organisational Policy & Governance',
                    'Property & Infrastructure',
                    'Radio Operator',
                    'Research, Service Design & User Insight',
                    'Search and Rescue',
                    'Support, Training & Advocacy',
                    'Sustainability & Energy'
                ]
            },
            description: 'Skills to filter by'
        },
        presence: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['in-person', 'remote']
            },
            description: 'Presence types to filter by'
        },
        languages: {
            type: 'array',
            items: {
                type: 'string',
                enum: ['en', 'fr', 'de', 'it', 'es', 'ru', 'zh', 'ja', 'ko', 'jp']
            },
            description: 'Languages to filter by (ISO 639 codes)'
        },
        minAge: {
            type: 'number',
            description: 'Minimum age to filter by'
        },
        maxAge: {
            type: 'number',
            description: 'Maximum age to filter by'
        },
        minor: {
            type: 'boolean',
            description: 'Filter by whether volunteer is a minor'
        },
        gender: {
            type: 'string',
            enum: ['male', 'female'],
            description: 'Gender to filter by'
        },
        timeCommitment: {
            type: 'string',
            enum: ['one time', 'weekly', 'monthly', 'flexible'],
            description: 'Time commitment to filter by'
        }
    },
    required: []
}

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
                    description: 'The DID of the volunteer to read'
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
        inputSchema: QueryVolunteersSchema,
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
    },
    {
        name: 'bulk-create',
        description: 'Bulk create random volunteers (admin only)',
        inputSchema: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of volunteers to create (default 100)'
                },
                fieldOptionality: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1,
                    description: 'Probability that fields will be excluded in generated volunteers (0.0 = never, 1.0 = always, default 0.5)'
                }
            },
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                count: {
                    type: 'number',
                    description: 'Number of volunteers created'
                }
            },
            required: ['count']
        }
    },
    {
        name: 'bulk-delete',
        description: 'Bulk delete volunteers (admin only)',
        inputSchema: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of volunteers to delete (default 20)'
                }
            },
            required: []
        },
        outputSchema: {
            type: 'object',
            properties: {
                success: {
                    type: 'boolean',
                    description: 'Whether the bulk delete operation succeeded'
                }
            },
            required: ['success']
        }
    }
];
