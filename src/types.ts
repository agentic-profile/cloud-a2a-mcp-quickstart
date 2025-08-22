export interface JsonRPCRequest {
    jsonrpc: string;
    id: string | number;
    method: string;
    params?: any;
}

export interface JsonRPCResponse {
    jsonrpc: string;
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

// A2A TaskHandler types
export interface TaskYieldUpdate {
    taskId: string;
    state: 'pending' | 'running' | 'completed' | 'failed';
    message?: string;
    progress?: number;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface TaskContext {
    requestId: string | number;
    method: string;
    params?: any;
    userId?: string;
    sessionId?: string;
    [key: string]: any;
}

export type TaskHandler = (context: TaskContext) => AsyncGenerator<TaskYieldUpdate, void, unknown>;

export type TaskHandlerHOC = (handler: TaskHandler) => (context: TaskContext) => AsyncGenerator<TaskYieldUpdate, void, unknown>; 