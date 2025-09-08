import { AgentCardProps } from '../utils.js';

export function agentCard({url}: AgentCardProps) {
    return {
        name: 'Charity Agent',
        description: 'An agent that finds volunteers for charities',
        url, 
        provider: {
            organization: 'Agent World Congress',
            url: 'https://agentworldcongress.org'
        },
        version: '0.0.2', // Incremented version
        capabilities: {
            streaming: false, // The new framework supports streaming
            pushNotifications: false, // Assuming not implemented for this agent yet
            stateTransitionHistory: false, // Agent uses history
        },
        // authentication: null, // Property 'authentication' does not exist on type 'AgentCard'.
        securitySchemes: undefined, // Or define actual security schemes if any
        security: undefined,
        defaultInputModes: ['text'],
        defaultOutputModes: ['text', 'task-status'], // task-status is a common output mode
        skills: [
            {
                id: 'find_volunteers',
                name: 'Find Volunteers',
                description: 'Find volunteers for a charity',
                tags: ['charity', 'volunteer'],
                examples: [
                    'Find volunteers to work for this cahrity',
                ],
                inputModes: ['text'],
                outputModes: ['text', 'task-status']
            },
        ],
        supportsAuthenticatedExtendedCard: false,
    };
}