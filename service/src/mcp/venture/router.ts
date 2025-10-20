import { Router, Request, Response } from 'express';
import { handleToolsCall } from './methods.js';
import { jrpcErrorAuthRequired, JsonRpcRequest, JsonRpcResponse, jrpcResult, processJsonRpcMethod } from '../../json-rpc/index.js';
import { JSONRPCRequest } from '@modelcontextprotocol/sdk/types.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { MCP_TOOLS } from './tools.js';
import { DEFAULT_MCP_INITIALIZE_RESPONSE } from '../misc.js';
import { handleMcpGet, handleMcpDelete } from '../mcp-stream.js';

const router = Router();

async function handleMcpRequest(req: Request, res: Response) {
    await processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        const requestId = jrpcRequest.id!;  // might be null
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
                if( !session )
                    return jrpcErrorAuthRequired( requestId );
                else
                    return await handleToolsCall( jrpcRequest as JSONRPCRequest, session );
            default:
                return null;
        }
    });
}

router.post('/', handleMcpRequest);
router.get('/', handleMcpGet);
router.delete('/', handleMcpDelete);

export default router;

const INITIALIZE_RESPONSE = {
    ...DEFAULT_MCP_INITIALIZE_RESPONSE,
    "serverInfo": {
        "name": "Venture Service",
        "title": "Publish and query venture profiles",
        "version": "1.0.0"
    }
};