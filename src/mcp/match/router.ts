import express from 'express';
import type { Request, Response } from 'express';
import { handleToolsList, handleToolsCall } from './methods';

const router = express.Router();

// MCP tools/list endpoint
router.post('/', async (req: Request, res: Response) => {
    const { method } = req.body;
    
    try {
        let response;
        
        switch (method) {
            case 'tools/list':
                response = await handleToolsList(req.body);
                break;
            case 'tools/call':
                response = await handleToolsCall(req.body);
                break;
            default:
                response = {
                    jsonrpc: '2.0',
                    id: req.body.id,
                    error: {
                        code: -32601,
                        message: `Method ${method} not found`
                    }
                };
        }
        
        res.json(response);
    } catch (error) {
        console.error('Error in match router:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body.id,
            error: {
                code: -32603,
                message: 'Internal error',
                data: (error as Error).message
            }
        });
    }
});

export default router;
