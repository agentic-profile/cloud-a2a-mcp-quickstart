import { Request, Response, NextFunction } from 'express';
import { JsonRPCRequest, JsonRPCResponse } from './types';
import { handleInitialize, handleToolsList, handleToolsCall, handleLocationUpdate, handleLocationQuery } from './mcp/location/methods';
import { handleVentureJsonRPC } from './a2a/venture/handler';
import { handleVCJsonRPC } from './a2a/vc/handler';

// Create Express app
import express from 'express';
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

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'agentic-profile-mcp'
    });
});

// Main JSON-RPC endpoint
app.post('/', async (req: Request, res: Response) => {
    try {
        console.log('🔍 Handling JSON-RPC request...');
        const body = req.body;
        console.log('🔍 Request body:', JSON.stringify(body, null, 2));
        
        const response = await handleJsonRPCRequest(body);
        res.json(response);
    } catch (error) {
        console.error('Error processing request:', error);
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
});

// A2A Venture endpoint
app.post('/venture', async (req: Request, res: Response) => {
    try {
        console.log('🚀 Handling A2A venture JSON-RPC request...');
        const body = req.body;
        console.log('🚀 Request body:', JSON.stringify(body, null, 2));
        
        const response = await handleVentureJsonRPC(body);
        res.json(response);
    } catch (error) {
        console.error('Error processing venture request:', error);
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
});

// A2A VC (Venture Capital) endpoint
app.post('/vc', async (req: Request, res: Response) => {
    try {
        console.log('💰 Handling A2A VC JSON-RPC request...');
        const body = req.body;
        console.log('💰 Request body:', JSON.stringify(body, null, 2));
        
        const response = await handleVCJsonRPC(body);
        res.json(response);
    } catch (error) {
        console.error('Error processing VC request:', error);
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
});

// Handle OPTIONS for CORS preflight
app.options('*', (_req: Request, res: Response) => {
    res.sendStatus(200);
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