export interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    route: string;
    buttonLabel?: string;
    agentUrl: string;
    mcpUrl?: string;
}