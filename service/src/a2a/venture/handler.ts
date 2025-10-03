import { v4 as uuidv4 } from 'uuid';
import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
} from "@a2a-js/sdk/server";
import { Message, TextPart } from '@a2a-js/sdk';
import { ClientAgentSession } from '@agentic-profile/auth';
import { resolveSession } from '../handle-a2a-request.js';
import { A2AEnvelope } from '../types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { StoreItem } from '../../stores/types.js';
import { resolveAgentId } from '../../mcp/misc.js';
import { a2aContextStore } from './context-store.js';
import { chatCompletion, ClaudeMessage } from '../../inference/claude-bedrock.js';

// For Venture profiles
const TABLE_NAME = process.env.DYNAMODB_VENTURE_PROFILES_TABLE_NAME || 'venture-profiles';
const ventureProfileStore = itemStore<StoreItem>({tableName: TABLE_NAME});
function idResolver(session: ClientAgentSession, kind: string): string {
    return `${resolveAgentId(session).did}^${kind}`;
}

// For agent-to-agent context
interface VentureContext {
    messageHistory: ClaudeMessage[];
}
const contextStore = a2aContextStore<VentureContext>('venture-a2a-context');


export class VentureExecutor implements AgentExecutor {  
    public cancelTask = async (
        taskId: string,
        _eventBus: ExecutionEventBus
    ): Promise<void> => {
        console.log(`VentureExecutor:cancelTask is not supported: ${taskId}`);
    };
  
    async execute(
        requestContext: RequestContext,
        eventBus: ExecutionEventBus
    ): Promise<void> {
        // A2A message and session
        const { userMessage: a2aUserMessage } = requestContext;
        const envelope = a2aUserMessage.metadata?.envelope as A2AEnvelope | undefined;
        const toAgentDid = envelope?.toAgentDid;
        if( !toAgentDid )
            throw new Error("Message envelope is missing recipient id (toAgentDid property)");
        const session = resolveSession(requestContext);
        if( !session )
            throw new Error("Session is required");
        const contextId = `${toAgentDid}^${session.agentDid}`;

        // currently only supports the first text part
        const textPart = a2aUserMessage.parts.find((part: any) => part.kind === "text") as TextPart | undefined;
        if( !textPart)
            throw new Error("No text part found in user message");

        // Claude...
        const { messageHistory = []} = await contextStore.fetchContext(contextId) ?? {}
        console.log('💼 Fetch message history:', messageHistory);

        const ventureId = idResolver(session, "venture");
        const ventureProfile = await ventureProfileStore.readItem(ventureId);
        console.log('💼 Venture profile:', ventureProfile);

        const prompt = textPart.text;
        const userMessage = { role: "user", content: prompt } as ClaudeMessage;
        const text = await chatCompletion([...messageHistory, userMessage]);

        messageHistory.push( userMessage, { role: "assistant", content: text } as ClaudeMessage);
        await contextStore.updateContext(contextId, { messageHistory });
        console.log('💼 Update message history:', messageHistory);

        const a2aAgentMessage: Message = {
            kind: "message",
            contextId,
            messageId: uuidv4(),
            role: "agent",
            parts: [
                {
                    kind: "text",
                    text
                }
            ],
            metadata: {}
        };

        eventBus.publish(a2aAgentMessage);
        eventBus.finished();
    }
}
