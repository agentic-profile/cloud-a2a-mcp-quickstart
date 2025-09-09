import { v4 as uuidv4 } from 'uuid';
import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
} from "@a2a-js/sdk/server";
import { Message, TextPart } from '@a2a-js/sdk';
//import { completion } from './inference.js';


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
        const { contextId } = requestContext;

        const textPart = requestContext.userMessage.parts.find((part: any) => part.kind === "text") as TextPart | undefined;
        if( !textPart)
            throw new Error("No text part found in user message");

        //const prompt = textPart.text;
        //const text = await completion(prompt);
        const text = "Hello, how can I help you?";
        
        const message: Message = {
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

        eventBus.publish(message);
        eventBus.finished();
    }
}