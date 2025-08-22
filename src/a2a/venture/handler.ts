import { TaskContext, TaskYieldUpdate } from '../../types';

// Core Venture task handler
export async function* handleVentureTasks(context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
    const { method } = context;
    
    switch (method) {
        case 'tasks/send':
            // Simulate a multi-step venture funding process
            yield {
                taskId: `venture_task_${Date.now()}`,
                state: 'running',
                message: 'Processing your venture funding request...',
                progress: 25,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'venture-service',
                    operation: 'tasks/send',
                    step: 'initializing'
                }
            };
            
            // Simulate some processing time
            await new Promise(resolve => setTimeout(resolve, 100));
            
            yield {
                taskId: `venture_task_${Date.now()}`,
                state: 'running',
                message: 'Reviewing your venture proposal...',
                progress: 50,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'venture-service',
                    operation: 'tasks/send',
                    step: 'reviewing'
                }
            };
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            yield {
                taskId: `venture_task_${Date.now()}`,
                state: 'running',
                message: 'Preparing funding details...',
                progress: 75,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'venture-service',
                    operation: 'tasks/send',
                    step: 'preparing'
                }
            };
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Final completion
            yield {
                taskId: `venture_task_${Date.now()}`,
                state: 'completed',
                message: 'Fund me! Here are my terms...',
                progress: 100,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'venture-service',
                    operation: 'tasks/send',
                    status: 'success',
                    funding: {
                        amount: '$2M Series A',
                        equity: '15%',
                        terms: 'Standard Series A terms',
                        timeline: '30 days'
                    }
                }
            };
            break;
                        
        default:
            throw new Error(`Method not supported: ${method}`);
    }
}
