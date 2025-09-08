import { AgentCardProps } from '../utils.js';

export function agentCard({url}: AgentCardProps) {
    return {
        name: 'Venture Agent',
        description: 'An agent that helps a startup develop their pitch deck',
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
                id: 'develop_pitch_deck',
                name: 'Develop Pitch Deck',
                description: 'Develop a pitch deck for a startup',
                tags: ['business', 'plan', 'venture'],
                examples: [
                    'Develop a pitch deck for a startup',
                ],
                inputModes: ['text'],
                outputModes: ['text', 'task-status']
            },
        ],
        supportsAuthenticatedExtendedCard: false,
    };
}