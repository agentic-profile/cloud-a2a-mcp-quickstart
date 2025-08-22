import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { JsonRPCRequest, JsonRPCResponse } from './types';
import { handleInitialize, handleToolsList, handleToolsCall, handleLocationUpdate, handleLocationQuery } from './mcp/location/methods';
import { handleVentureTasks } from './a2a/venture/handler';
import { handleVCTasks } from './a2a/vc/handler';
import { handleHireMeTasks } from './a2a/hireme/handler';

// Create Express app
import { withDefaultMiddleware, handleA2ARequest } from './a2a/utils';
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    next();
});

// A2A setup
const handleHireMeTasksWithMiddleware = withDefaultMiddleware(handleHireMeTasks);
const handleVentureTasksWithMiddleware = withDefaultMiddleware(handleVentureTasks);
const handleVCTasksWithMiddleware = withDefaultMiddleware(handleVCTasks);

// Health check endpoint
const started = new Date().toISOString();
app.get('/status', (_req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        started,
        timestamp: new Date().toISOString(),
        service: 'agentic-profile-mcp'
    });
});

// A2A HireMe TaskHandler endpoint
app.post('/a2a/hireme', async (req: Request, res: Response) => {
    await handleA2ARequest( req, res, handleHireMeTasksWithMiddleware );
});

// A2A Venture TaskHandler endpoint
app.post('/a2a/venture', async (req: Request, res: Response) => {
    await handleA2ARequest(req, res, handleVentureTasksWithMiddleware);
});

// A2A VC TaskHandler endpoint
app.post('/a2a/vc', async (req: Request, res: Response) => {
    await handleA2ARequest(req, res, handleVCTasksWithMiddleware);
});

// Handle OPTIONS for CORS preflight
app.options('*', (_req: Request, res: Response) => {
    res.sendStatus(200);
});

// Serve static files from www directory
app.use(express.static('www'));

// Serve the web interface for non-API routes
app.get('/', (_req: Request, res: Response) => {
    res.sendFile('index.html', { root: 'www' });
});



// Error handling middleware
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        jsonrpc: '2.0',
        id: 'unhandled-error',
        error: {
            code: -32603,
            message: 'Internal error',
            data: error.message
        }
    });
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
        jsonrpc: '2.0',
        id: 'not-found',
        error: {
            code: -32601,
            message: 'Method not found'
        }
    });
});

export async function handleJsonRPCRequest(body: any): Promise<JsonRPCResponse> {
    console.log('handleJsonRPCRequest', body);
    
    const request: JsonRPCRequest = body;
    
    // Validate JSON-RPC request
    if (!request.jsonrpc || request.jsonrpc !== '2.0' || !request.id || !request.method) {
        return {
            jsonrpc: '2.0',
            id: 'invalid',
            error: {
                code: -32600,
                message: 'Invalid Request'
            }
        };
    }

    // Handle different MCP methods
    let response: JsonRPCResponse;
    
    switch (request.method) {
        case 'initialize':
            response = await handleInitialize(request);
            break;
        case 'tools/list':
            response = await handleToolsList(request);
            break;
        case 'tools/call':
            response = await handleToolsCall(request);
            break;
        case 'locationUpdate':
            response = await handleLocationUpdate(request, request.params);
            break;
        case 'locationQuery':
            response = await handleLocationQuery(request);
            break;
        default:
            response = {
                jsonrpc: '2.0',
                id: request.id,
                error: {
                    code: -32601,
                    message: 'Method not found'
                }
            };
    }

    return response;
}

export { app }; 