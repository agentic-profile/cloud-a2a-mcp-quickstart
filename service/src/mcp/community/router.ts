import { Router, Request, Response } from 'express';
import { handleToolsCall } from './methods.js';
import { jrpcErrorAuthRequired, JsonRpcRequest, JsonRpcResponse, jrpcResult, processJsonRpcMethod } from '../../json-rpc/index.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { MCP_TOOLS } from './tools.js';

const router = Router();

// MCP tools/list endpoint
router.post('/', async (req: Request, res: Response) => {
    await processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        const requestId = jrpcRequest.id!;
        switch( jrpcRequest.method ) {
            case 'tools/list':
                return jrpcResult(requestId, { tools: MCP_TOOLS } );
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
