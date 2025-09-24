import express from 'express';
import cors from 'cors';
import type { Request, Response, NextFunction } from 'express';
import wellKnownDidDocument from './well-known-did.json' with { type: 'json' };

// A2A handlers and helpers
import { VentureExecutor, agentCard as ventureCard } from './a2a/venture/index.js';
import { CapitalExecutor, agentCard as capitalCard } from './a2a/capital/index.js';
import { VolunteerExecutor, agentCard as volunteerCard } from './a2a/volunteer/index.js';
import { CharityExecutor, agentCard as charityCard } from './a2a/charity/index.js';

// MCP handlers
import locationRouter from "./mcp/location/router.js";
import reputationRouter from "./mcp/reputation/router.js";
import vcMatchRouter from "./mcp/vc-match/router.js";
import communityRouter from "./mcp/community/router.js";
import ventureRouter from "./mcp/venture/router.js";
import walletRouter from "./mcp/wallet/router.js";
import { A2AServiceRouter } from './a2a/router.js';

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
app.get('/status', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        started,
        timestamp: new Date().toISOString(),
        service: 'agentic-profile-mcp',
        url: req.originalUrl
    });
});

// Well known did.json
app.get('/.well-known/did.json', (req: Request, res: Response) => {
    wellKnownDidDocument.id = `did:web:${req.get('host')}`;
    res.json(wellKnownDidDocument);
});

// A2A handlers
app.use('/a2a/venture', A2AServiceRouter( new VentureExecutor(), ventureCard ));
app.use('/a2a/capital', A2AServiceRouter( new CapitalExecutor(), capitalCard ));
app.use('/a2a/volunteer', A2AServiceRouter( new VolunteerExecutor(), volunteerCard ));
app.use('/a2a/charity', A2AServiceRouter( new CharityExecutor(), charityCard ));

// MCP handlers
app.use('/mcp/location', locationRouter);
app.use('/mcp/vc-match', vcMatchRouter);
app.use('/mcp/community', communityRouter);
app.use('/mcp/reputation', reputationRouter);
app.use('/mcp/venture', ventureRouter);
app.use('/mcp/wallet', walletRouter);

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