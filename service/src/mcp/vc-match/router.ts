import express from 'express';
import type { Request, Response } from 'express';
import { handleToolsList, handleToolsCall } from './methods.js';
import { jrpcErrorAuthRequired, JsonRpcRequest, JsonRpcResponse, processJsonRpcMethod } from '../../json-rpc/index.js';
import { ClientAgentSession } from '@agentic-profile/auth';

const router = express.Router();

// MCP tools/list endpoint
router.post('/', async (req: Request, res: Response) => {
    await processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        switch( jrpcRequest.method ) {
            case 'tools/list':
                return await handleToolsList(req.body);
            case 'tools/call':
                if( !session )
                    return jrpcErrorAuthRequired( jrpcRequest.id! );
                else
                    return await handleToolsCall(req.body, session);
            default:
                return null;
        }
    });
});

export default router;
