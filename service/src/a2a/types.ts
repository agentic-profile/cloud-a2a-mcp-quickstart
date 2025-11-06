export interface AgentCardProps {
    url: string;
}

export type AgentCardBuilder = (props: AgentCardProps) => any;

export interface PromptStrategy {
    agents: {
        [key: string]: {
            role: string;
            goal: string;
        };
    };
}
