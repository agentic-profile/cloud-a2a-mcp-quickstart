import { Router, Request, Response, type Router as ExpressRouter } from 'express';
import { handleToolsCall } from './methods.js';
import { JsonRpcRequest, JsonRpcResponse, jrpcResult, processJsonRpcMethod } from '../../json-rpc/index.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { MCP_TOOLS } from './tools.js';

const router: ExpressRouter = Router();

router.post('/', async (req: Request, res: Response) => {
    await processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        const requestId = jrpcRequest.id!;
        switch( jrpcRequest.method ) {
            case 'tools/list':
                return jrpcResult(requestId, { tools: MCP_TOOLS } );
            case 'tools/call':
                return await handleToolsCall(req.body, session);
            default:
                return null;
        }
    });
});

export default router;
