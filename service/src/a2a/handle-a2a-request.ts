import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
    AgentExecutionEvent
} from '@a2a-js/sdk/server';
import { MessageSendParams, TaskStatus } from '@a2a-js/sdk';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { jrpcErrorAuthRequired, JsonRpcRequest, JsonRpcResponse, processJsonRpcMethod } from '../json-rpc/index.js';
import { ClientAgentSession } from '@agentic-profile/auth';

export async function handleA2ARequest( req: Request, res: Response, executor: AgentExecutor, requireAuth: boolean = true ) {

    processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        console.log('💼 Handling A2A request with executor...');
        console.log('💼 Request body:', JSON.stringify(jrpcRequest, null, 4));

        // Required authentication
        if( requireAuth && !session )
            return jrpcErrorAuthRequired( jrpcRequest.id! );
        
        // Create request context from request body
        const { params, id } = jrpcRequest;
        const { contextId = uuidv4(), includeAllUpdates = false } = req.body
        const sendParams = params as unknown as MessageSendParams;
        const requestContext = {
            taskId: id ? `${id}` : '', // RequestContext doesn't support null/undefined, even though A2A allows it
            contextId,
            userMessage: sendParams.message,
            session
        } as RequestContext;

        // Create an event bus to collect updates
        const updates: AgentExecutionEvent[] = [];
        const eventBus: ExecutionEventBus = {
            publish: (event: AgentExecutionEvent) => {
                updates.push(event);
                console.log('💼 Task event:', event);
            },
            finished: () => {
                console.log('💼 Task execution finished');
            },
            on: (_eventName: "event" | "finished", _listener: (event: AgentExecutionEvent) => void) => {
                return eventBus;
            },
            off: (_eventName: "event" | "finished", _listener: (event: AgentExecutionEvent) => void) => { 
                return eventBus;
            },
            once: (_eventName: "event" | "finished", _listener: (event: AgentExecutionEvent) => void) => {
                return eventBus;
            },
            removeAllListeners: (_eventName?: "event" | "finished") => {
                return eventBus;
            }
        };

        // Execute the task using the executor
        await executor.execute(requestContext, eventBus);
        
        // Find the final update
        let result;
        if( updates.length == 0 ) {
            throw new Error('No task updates received from executor');
        } else if( updates.length == 1 && updates[0].kind === "message" ) {
            result = updates[0];
        } else {
            const finalUpdate = updates.find(update => update.kind === "status-update" && update.status.state === "completed") || updates[updates.length - 1];
            if( !finalUpdate ) {
                throw new Error('No task updates received from executor');
            }

            const status: TaskStatus | undefined = (finalUpdate as any).status as TaskStatus;

            result = {
                taskId: id,
                ...finalUpdate,
                final: status?.state === "completed",
                ...(includeAllUpdates && { allUpdates: updates })
            };
        }

        return {
            jsonrpc: '2.0',
            id: id ?? '',
            result
        };
    });
}

export function resolveSession(requestContext: RequestContext): ClientAgentSession | undefined {
    return (requestContext as any)?.session as ClientAgentSession | undefined;
}
