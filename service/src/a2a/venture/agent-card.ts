import { AgentCardProps } from '../utils.js';

export function agentCard({url}: AgentCardProps) {
    return {
        name: 'Movie Agent',
        description: 'An agent that can answer questions about movies and actors using TMDB.',
        // Adjust the base URL and port as needed. /a2a is the default base in A2AExpressApp
        url, 
        provider: {
            organization: 'A2A Samples',
            url: 'https://example.com/a2a-samples' // Added provider URL
        },
        version: '0.0.2', // Incremented version
        capabilities: {
            streaming: true, // The new framework supports streaming
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
                id: 'general_movie_chat',
                name: 'General Movie Chat',
                description: 'Answer general questions or chat about movies, actors, directors.',
                tags: ['movies', 'actors', 'directors'],
                examples: [
                    'Tell me about the plot of Inception.',
                    'Recommend a good sci-fi movie.',
                    'Who directed The Matrix?',
                    'What other movies has Scarlett Johansson been in?',
                    'Find action movies starring Keanu Reeves',
                    'Which came out first, Jurassic Park or Terminator 2?',
                ],
                inputModes: ['text'], // Explicitly defining for skill
                outputModes: ['text', 'task-status'] // Explicitly defining for skill
            },
        ],
        supportsAuthenticatedExtendedCard: false,
    };
}