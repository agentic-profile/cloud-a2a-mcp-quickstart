import { TaskHandler, TaskHandlerHOC, TaskContext, TaskYieldUpdate } from '../types';
import { Request, Response } from 'express';

/**
 * Higher-order component that adds logging to a TaskHandler
 */
export const withLogging: TaskHandlerHOC = (handler: TaskHandler) => {
    return async function* (context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
        console.log(`🚀 Starting task execution for method: ${context.method}`);
        console.log(`📋 Task context:`, JSON.stringify(context, null, 2));
        
        try {
            yield* handler(context);
            console.log(`✅ Task completed successfully for method: ${context.method}`);
        } catch (error) {
            console.error(`❌ Task failed for method: ${context.method}:`, error);
            throw error;
        }
    };
};

/**
 * Higher-order component that adds timing to a TaskHandler
 */
export const withTiming: TaskHandlerHOC = (handler: TaskHandler) => {
    return async function* (context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
        const startTime = Date.now();
        
        try {
            yield* handler(context);
            const duration = Date.now() - startTime;
            console.log(`⏱️ Task completed in ${duration}ms for method: ${context.method}`);
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`⏱️ Task failed after ${duration}ms for method: ${context.method}:`, error);
            throw error;
        }
    };
};

/**
 * Higher-order component that adds error handling to a TaskHandler
 */
export const withErrorHandling: TaskHandlerHOC = (handler: TaskHandler) => {
    return async function* (context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
        try {
            yield* handler(context);
        } catch (error) {
            const errorUpdate: TaskYieldUpdate = {
                taskId: `error_${Date.now()}`,
                state: 'failed',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString(),
                metadata: {
                    method: context.method,
                    requestId: context.requestId,
                    error: error instanceof Error ? error.stack : String(error)
                }
            };
            
            yield errorUpdate;
            throw error;
        }
    };
};

/**
 * Higher-order component that adds progress tracking to a TaskHandler
 */
export const withProgress: TaskHandlerHOC = (handler: TaskHandler) => {
    return async function* (context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
        // Yield initial progress
        yield {
            taskId: `progress_${Date.now()}`,
            state: 'pending',
            message: 'Task started',
            progress: 0,
            timestamp: new Date().toISOString(),
            metadata: { method: context.method }
        };
        
        yield* handler(context);
        
        // Yield completion progress
        yield {
            taskId: `progress_${Date.now()}`,
            state: 'completed',
            message: 'Task completed',
            progress: 100,
            timestamp: new Date().toISOString(),
            metadata: { method: context.method }
        };
    };
};

/**
 * Composes multiple higher-order components
 */
export const composeHOCs = (...hocs: TaskHandlerHOC[]): TaskHandlerHOC => {
    return (handler: TaskHandler) => {
        return hocs.reduceRight((acc, hoc) => hoc(acc), handler);
    };
};

/**
 * Default HOC composition with common middleware
 */
export const withDefaultMiddleware = composeHOCs(
    withLogging,
    withTiming,
    withErrorHandling,
    withProgress
);

export async function handleA2ARequest( req: Request, res: Response, taskHandler: TaskHandler ) {
    try {
        console.log('💼 Handling A2A HireMe TaskHandler request...');
        const body = req.body;
        console.log('💼 Request body:', JSON.stringify(body, null, 2));
        
        // Create task context from request
        const context: TaskContext = {
            requestId: body.id || 'unknown',
            method: body.method || 'unknown',
            params: body.params || {},
            userId: body.userId,
            sessionId: body.sessionId
        };
        
        // Execute the TaskHandler and collect all updates
        const updates: any[] = [];
        const handledTask = taskHandler(context);
        
        for await (const update of handledTask) {
            updates.push(update);
            console.log('💼 Task update:', update);
        }
        
        // Return the final update (or all updates if requested)
        const finalUpdate = updates[updates.length - 1];
        const includeAllUpdates = body.includeAllUpdates === true;
        
        res.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
                taskId: finalUpdate.taskId,
                state: finalUpdate.state,
                message: finalUpdate.message,
                timestamp: finalUpdate.timestamp,
                metadata: finalUpdate.metadata,
                ...(includeAllUpdates && { allUpdates: updates })
            }
        });
        
    } catch (error) {
        console.error(`Error processing ${taskHandler} request:`, error);
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
