import { TaskContext, TaskYieldUpdate } from '../../types';

// Core VC (Venture Capital) task handler
export async function* handleVCTasks(context: TaskContext): AsyncGenerator<TaskYieldUpdate, void, unknown> {
    const { method } = context;
    
    switch (method) {
        case 'tasks/send':
            // Simulate a multi-step VC funding process
            yield {
                taskId: `vc_task_${Date.now()}`,
                state: 'running',
                message: 'Processing your VC funding request...',
                progress: 25,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'vc-service',
                    operation: 'tasks/send',
                    step: 'initializing'
                }
            };
            
            // Simulate some processing time
            await new Promise(resolve => setTimeout(resolve, 100));
            
            yield {
                taskId: `vc_task_${Date.now()}`,
                state: 'running',
                message: 'Reviewing your business plan...',
                progress: 50,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'vc-service',
                    operation: 'tasks/send',
                    step: 'reviewing'
                }
            };
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            yield {
                taskId: `vc_task_${Date.now()}`,
                state: 'running',
                message: 'Preparing investment terms...',
                progress: 75,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'vc-service',
                    operation: 'tasks/send',
                    step: 'preparing'
                }
            };
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Final completion
            yield {
                taskId: `vc_task_${Date.now()}`,
                state: 'completed',
                message: 'Here\'s a check! Here are our terms...',
                progress: 100,
                timestamp: new Date().toISOString(),
                metadata: {
                    service: 'vc-service',
                    operation: 'tasks/send',
                    status: 'success',
                    investment: {
                        amount: '$5M Series B',
                        equity: '20%',
                        terms: 'Standard Series B terms',
                        timeline: '45 days',
                        boardSeat: true
                    }
                }
            };
            break;
                        
        default:
            throw new Error(`Method not supported: ${method}`);
    }
}
