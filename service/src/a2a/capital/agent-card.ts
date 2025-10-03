import { AgentCardProps } from '../types.js';

export function agentCard({url}: AgentCardProps) {
    return {
        name: 'Capital Partner Agent',
        description: 'An agent that reviews business plans presented by venture agents',
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
                id: 'review_business_plan',
                name: 'Review Business Plan',
                description: 'Review a business plan presented by a venture agent',
                tags: ['business', 'plan', 'venture'],
                examples: [
                    'Review the business plan and decide if it is worth investing in',
                ],
                inputModes: ['text'],
                outputModes: ['text', 'task-status']
            },
        ],
        supportsAuthenticatedExtendedCard: false,
    };
}