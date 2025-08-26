export const MCP_TOOLS = [
    {
        name: 'add',
        description: 'Add a new business to the system',
        inputSchema: {
            type: 'object',
            properties: {
                business: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Business name'
                        },
                        description: {
                            type: 'string',
                            description: 'Business description'
                        },
                        location: {
                            type: 'object',
                            properties: {
                                latitude: {
                                    type: 'number',
                                    description: 'Latitude coordinate'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Longitude coordinate'
                                },
                                address: {
                                    type: 'string',
                                    description: 'Business address'
                                }
                            },
                            required: ['latitude', 'longitude', 'address']
                        },
                        category: {
                            type: 'string',
                            description: 'Business category (e.g., restaurant, retail, service)'
                        },
                        contact: {
                            type: 'object',
                            properties: {
                                phone: {
                                    type: 'string',
                                    description: 'Phone number'
                                },
                                email: {
                                    type: 'string',
                                    description: 'Email address'
                                },
                                website: {
                                    type: 'string',
                                    description: 'Website URL'
                                }
                            }
                        }
                    },
                    required: ['name', 'description', 'location', 'category']
                }
            },
            required: ['business']
        }
    },
    {
        name: 'find',
        description: 'Find businesses based on criteria',
        inputSchema: {
            type: 'object',
            properties: {
                criteria: {
                    type: 'object',
                    properties: {
                        category: {
                            type: 'string',
                            description: 'Business category to search for'
                        },
                        location: {
                            type: 'object',
                            properties: {
                                latitude: {
                                    type: 'number',
                                    description: 'Center point latitude'
                                },
                                longitude: {
                                    type: 'number',
                                    description: 'Center point longitude'
                                },
                                radius: {
                                    type: 'number',
                                    description: 'Search radius in kilometers'
                                }
                            }
                        },
                        name: {
                            type: 'string',
                            description: 'Partial business name to search for'
                        }
                    }
                }
            },
            required: ['criteria']
        }
    }
];
