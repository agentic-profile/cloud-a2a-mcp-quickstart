import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';

// A2A handlers and helpers
import { VentureExecutor } from './a2a/venture/handler.js';
import { VCExecutor } from './a2a/vc/handler.js';
import { HireMeExecutor } from './a2a/hireme/handler.js';
import { handleA2ARequest } from './a2a/utils.js';

// MCP handlers
import locationRouter from "./mcp/location/router.js";
import matchRouter from "./mcp/match/router.js";

// Create Express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'WWW-Authenticate',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Origin',
        'WWW-Authenticate'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    await handleA2ARequest( req, res, new HireMeExecutor() );
});

// A2A Venture TaskHandler endpoint
app.post('/a2a/venture', async (req: Request, res: Response) => {
    await handleA2ARequest(req, res, new VentureExecutor() );
});

// A2A VC TaskHandler endpoint
app.post('/a2a/vc', async (req: Request, res: Response) => {
    await handleA2ARequest(req, res, new VCExecutor() );
});

// MCP handlers
app.use('/mcp/location', locationRouter);
app.use('/mcp/match', matchRouter);

// Serve the web interface for non-API routes
app.get('/', (_req: Request, res: Response) => {
    res.sendFile('index.html', { root: 'www' });
});

// Serve static files from www directory (after specific routes)
app.use(express.static('www'));

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

export { app }; 