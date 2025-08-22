import {
    AgentExecutor,
    RequestContext,
    ExecutionEventBus,
    AgentExecutionEvent
} from '@a2a-js/sdk/server';
import { JSONRPCRequest, MessageSendParams } from '@a2a-js/sdk';
import { Request, Response } from 'express';

export async function handleA2ARequest( req: Request, res: Response, executor: AgentExecutor ) {
    try {
        console.log('💼 Handling A2A request with executor...');
        const rpcReq = req.body as JSONRPCRequest;
        const { contextId, includeAllUpdates = false } = req.body
        console.log('💼 Request body:', JSON.stringify(rpcReq, null, 2));
        
        // Create request context from request body
        const { /*jsonrpc, method, */ params, id } = rpcReq;
        const sendParams = params as unknown as MessageSendParams;
        const requestContext: RequestContext = {
            taskId: `${id}`,
            contextId,
            userMessage: sendParams.message
        };

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
        const finalUpdate = updates.find(update => update.kind === "status-update" && update.status.state === "completed") || updates[updates.length - 1];
        
        if (!finalUpdate) {
            throw new Error('No task updates received from executor');
        }

        // Return the final update (or all updates if requested)
        //const includeAllUpdates = req.body.includeAllUpdates === true;
        
        res.json({
            jsonrpc: '2.0',
            id,
            result: {
                taskId: id,
                contextId: finalUpdate.contextId,
                //state: finalUpdate.status?.state,
                //message: finalUpdate.status?.message,
                //timestamp: finalUpdate.status?.timestamp,
                //final: finalUpdate.status?.state === "completed",
                ...(includeAllUpdates && { allUpdates: updates })
            }
        });
        
    } catch (error) {
        console.error(`Error processing A2A request:`, error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: 'error',
            error: {
                code: -32603,
                message: 'Internal error',
                data: error instanceof Error ? error.message : 'Unknown error'
            }
        });
    }
}
