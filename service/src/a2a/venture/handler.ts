import { v4 as uuidv4 } from 'uuid';
import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
} from "@a2a-js/sdk/server";
import { Message, TextPart } from '@a2a-js/sdk';
import { AgentMessageEnvelope } from '@agentic-profile/common';
import { resolveSession } from '../handle-a2a-request.js';
import { PromptStrategy } from '../types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { StoreItem } from '../../stores/types.js';
import { a2aContextStore } from './context-store.js';
import { chatCompletion, ClaudeMessage } from '../../inference/claude-bedrock.js';
import { parseDid } from '../../utils/did.js';
import { createSystemPrompt } from './prompt-templates.js';
import { extractJson } from '../../utils/json.js';
import { generateMarkdownSummary } from './from-website/markdown-generator.js';
import { VentureSummary } from './from-website/venture-types.js';

// For Venture profiles
const TABLE_NAME = process.env.DYNAMODB_VENTURE_PROFILES_TABLE_NAME || 'venture-profiles';
const ventureProfileStore = itemStore<StoreItem>({tableName: TABLE_NAME});

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
        //const envelope = a2aUserMessage.metadata?.envelope as AgentMessageEnvelope | undefined;
        const a2aEnvelope = (requestContext as any).params.metadata?.envelope as AgentMessageEnvelope | undefined;
        const toAgentDid = a2aEnvelope?.to;
        if( !toAgentDid )
            throw new Error("Message envelope is missing recipient id ('to' property)");
        const { did: toDid, fragment: toFragment } = parseDid(toAgentDid);
        if( !toFragment )
            throw new Error("Invalid toAgentDid, missing fragment: " + toAgentDid);
        if( toFragment !== "venture" )
            throw new Error("Invalid toAgentDid, fragment is not 'venture': " + toAgentDid);

        // get the session
        const session = resolveSession(requestContext);
        if( !session )
            throw new Error("Authenticated session is required");
        const fromAgentDid = session.agentDid;  // might or might not include fragment...
        const contextId = `${toAgentDid}^${fromAgentDid}`;  // e.g. did:web:iamagentic.ai:1#venture^did:web:iamagentic.ai:1#venture

        // currently only supports the first text part
        const textPart = a2aUserMessage.parts.find((part: any) => part.kind === "text") as TextPart | undefined;
        if( !textPart)
            throw new Error("No text part found in user message");

        // read my profile (who am I?) = toAgentDid (not the client)
        const ventureId = `${toDid}^venture`;
        const ventureSummary = await ventureProfileStore.readItem(ventureId) as unknown as VentureSummary;
        if( !ventureSummary )
            throw new Error(`Venture summary not found for ${ventureId}`);
        console.log('💼 Venture summary:', ventureSummary);

        // custom goals/prompt/strategy depending on the target agent I am talking to...
        const strategyId = `${toDid}^venture-strategy`;
        const strategy = await ventureProfileStore.readItem(strategyId) as unknown as PromptStrategy;
        if( !strategy )
            throw new Error(`Venture strategy not found for ${strategyId}`);
        console.log('💼 Venture strategy:', strategy);

        let { messageHistory = [] } = await contextStore.fetchContext(contextId) ?? {}
        console.log('💼 Fetch message history:', messageHistory);

        if( a2aEnvelope?.rewind ) {
            console.log('💼 Rewinding message history to:', a2aEnvelope.rewind);
            messageHistory = [];
        }

        //
        // Claude...
        //

        const prompt = textPart.text;
        const userMessage = { role: "user", content: prompt } as ClaudeMessage;

        let text;
        if( messageHistory.length === 0 ) {
            const md = generateMarkdownSummary(ventureSummary);
            text = `Hello!  A quick summary of what I'm working on...\n\n${md}`;
        } else {
            // continue the conversation
            const options = {
                system: createSystemPrompt( ventureSummary, fromAgentDid, strategy ),
                messages: [...messageHistory, userMessage]
            };
            text = await chatCompletion(options);
        }

        // any JSON resolution?
        let metadata = undefined;
        const { jsonObjects, textWithoutJson } = extractJson(text);
        jsonObjects?.forEach((json: any) => {
            console.log('💼 JSON object:', json);
            if( json.metadata?.resolution ) {
                metadata = json.metadata;
                text = textWithoutJson;
            }
        });

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
            metadata
        };

        eventBus.publish(a2aAgentMessage);
        eventBus.finished();
    }
}
