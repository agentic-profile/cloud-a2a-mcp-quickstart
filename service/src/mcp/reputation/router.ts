import { Router, Request, Response } from 'express';
import { handleToolsCall, handleToolsList } from './methods.js';
import { jrpcErrorAuthRequired, JsonRpcRequest, JsonRpcResponse, processJsonRpcMethod } from '../../json-rpc/index.js';
import { JSONRPCRequest } from '@modelcontextprotocol/sdk/types.js';
import { ClientAgentSession } from '@agentic-profile/auth';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    await processJsonRpcMethod( req, res, async ( jrpcRequest: JsonRpcRequest, session: ClientAgentSession | null ): Promise<JsonRpcResponse | null> => {
        switch( jrpcRequest.method ) {
            case 'tools/list':
                return await handleToolsList( jrpcRequest as JSONRPCRequest );
            case 'tools/call':
                if( !session )
                    return jrpcErrorAuthRequired( jrpcRequest.id! );
                else
                    return await handleToolsCall( jrpcRequest as JSONRPCRequest, session );
            default:
                return null;
        }
    });
});

export default router;