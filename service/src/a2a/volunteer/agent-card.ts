import { AgentCardProps } from '../utils.js';

export function agentCard({url}: AgentCardProps) {
    return {
        name: 'Volunteer Agent',
        description: 'An agent that finds volunteering opportunities',
        // Adjust the base URL and port as needed. /a2a is the default base in A2AExpressApp
        url, 
        provider: {
            organization: 'A2A Samples',
            url: 'https://example.com/a2a-samples' // Added provider URL
        },
        version: '0.0.2', // Incremented version
        capabilities: {
            streaming: false, // The new framework supports streaming
            pushNotifications: false, // Assuming not implemented for this agent yet
            stateTransitionHistory: true, // Agent uses history
        },
        // authentication: null, // Property 'authentication' does not exist on type 'AgentCard'.
        securitySchemes: undefined, // Or define actual security schemes if any
        security: undefined,
        defaultInputModes: ['text'],
        defaultOutputModes: ['text', 'task-status'], // task-status is a common output mode
        skills: [
            {
                id: 'find_volunteering_opportunities',
                name: 'Find Volunteering Opportunities',
                description: 'Find volunteering opportunities',
                tags: ['volunteer', 'opportunity'],
                examples: [
                    'Find volunteering opportunities with this charity',
                ],
                inputModes: ['text'], // Explicitly defining for skill
                outputModes: ['text', 'task-status'] // Explicitly defining for skill
            },
        ],
        supportsAuthenticatedExtendedCard: false,
    };
}