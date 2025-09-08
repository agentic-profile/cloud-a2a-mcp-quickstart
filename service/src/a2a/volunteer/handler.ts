import { v4 as uuidv4 } from 'uuid';
import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
} from "@a2a-js/sdk/server";
import { Message } from '@a2a-js/sdk';


export class VolunteerExecutor implements AgentExecutor {  
    public cancelTask = async (
        taskId: string,
        _eventBus: ExecutionEventBus
    ): Promise<void> => {
        console.log(`VolunteerExecutor:cancelTask is not supported: ${taskId}`);
    };
  
    async execute(
        requestContext: RequestContext,
        eventBus: ExecutionEventBus
    ): Promise<void> {
        const { contextId } = requestContext;

        const message: Message = {
            kind: "message",
            contextId,
            messageId: uuidv4(),
            role: "agent",
            parts: [
                {
                    kind: "text",
                    text: "How can I help?"
                }
            ],
            metadata: {}
        };

        eventBus.publish(message);
        eventBus.finished();
    }
}
