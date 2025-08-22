import { v4 as uuidv4 } from 'uuid';
import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
    AgentExecutionEvent,
} from "@a2a-js/sdk/server";


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
        const { taskId, contextId /*, userMessage */ } = requestContext;

        const finalUpdate: AgentExecutionEvent = {
            kind: "status-update",
            taskId,
            contextId,
            status: {
                state: "completed",
                message: {
                    kind: "message",
                    role: "agent",
                    messageId: uuidv4(),
                    taskId,
                    contextId,
                    parts: [
                        {
                            kind: "text",
                            text: "Hello, world!"
                        }
                    ],
                },
                timestamp: new Date().toISOString(),
            },
            final: true,
        };
        eventBus.publish(finalUpdate);
        eventBus.finished();
    }
}
