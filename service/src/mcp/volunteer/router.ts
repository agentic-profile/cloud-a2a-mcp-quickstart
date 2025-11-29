import { Router, Request, Response, type Router as ExpressRouter } from 'express';
import { handleToolsCall } from './methods.js';
import { JsonRpcRequest, JsonRpcResponse, jrpcResult, processJsonRpcMethod } from '../../json-rpc/index.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { MCP_TOOLS } from './tools.js';
import { handleMcpGet, handleMcpDelete } from '../mcp-stream.js';
import { DEFAULT_MCP_INITIALIZE_RESPONSE } from '../misc.js';

const router: ExpressRouter = Router();

async function handleMcpRequest(req: Request, res: Response) {
    await processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        const requestId = jrpcRequest.id!;
        switch( jrpcRequest.method ) {
            case 'initialize':
                return jrpcResult(requestId, INITIALIZE_RESPONSE );
            case 'notifications/initialized':
                return jrpcResult(requestId, {} );
            case 'logging/setLevel':
                return jrpcResult(requestId, {} );
            case 'tools/list':
                return jrpcResult(requestId, { tools: MCP_TOOLS } );
            case 'tools/call':
                return await handleToolsCall(req.body, session);
            default:
                return null;
        }
    });
};

router.post('/', handleMcpRequest);
router.get('/', handleMcpGet);
router.delete('/', handleMcpDelete);

export default router;

const INITIALIZE_RESPONSE = {
    ...DEFAULT_MCP_INITIALIZE_RESPONSE,
    "serverInfo": {
        "name": "Volunteer Service",
        "title": "Publish and query volunteer profiles",
        "version": "1.0.0"
    }
};
