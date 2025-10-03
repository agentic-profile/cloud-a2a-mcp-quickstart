export interface A2AEnvelope {
    toAgentDid: string;
}

export interface AgentCardProps {
    url: string;
}

export type AgentCardBuilder = (props: AgentCardProps) => any;