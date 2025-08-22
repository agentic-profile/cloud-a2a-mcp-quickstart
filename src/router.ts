import express from 'express';
import type { Request, Response, NextFunction } from 'express';

// A2A handlers and helpers
import { VentureExecutor } from './a2a/venture/handler';
import { VCExecutor } from './a2a/vc/handler';
import { HireMeExecutor } from './a2a/hireme/handler';
import { handleA2ARequest } from './a2a/utils';

// MCP handler
import locationRouter from "./mcp/location/router";

// Create Express app
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

// Handle OPTIONS for CORS preflight - Express 5.x compatible
// Use specific routes instead of wildcards
app.options('/a2a/hireme', (_req: Request, res: Response) => {
    res.sendStatus(200);
});
app.options('/a2a/venture', (_req: Request, res: Response) => {
    res.sendStatus(200);
});
app.options('/a2a/vc', (_req: Request, res: Response) => {
    res.sendStatus(200);
});
app.options('/mcp/location', (_req: Request, res: Response) => {
    res.sendStatus(200);
});
app.options('/', (_req: Request, res: Response) => {
    res.sendStatus(200);
});

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

// 404 handler - Express 5.x compatible
// Remove wildcard route and let Express handle 404s naturally
// app.use('/*', (_req: Request, res: Response) => {
//     res.status(404).json({
//         jsonrpc: '2.0',
//         id: 'not-found',
//         error: {
//             code: -32601,
//             message: 'Method not found'
//         }
//     });
// });

export { app }; 