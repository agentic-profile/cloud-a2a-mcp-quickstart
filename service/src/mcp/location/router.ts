import { Router, Request, Response } from 'express';
import { handleToolsCall, handleToolsList } from './methods';
import { handleMCPMethod } from '../utils';
import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    await handleMCPMethod( req, res, async ( rpcRequest: JSONRPCRequest ): Promise<JSONRPCResponse | JSONRPCError | null> => {
        const { method } = rpcRequest;
            switch( method ) {
                case 'tools/list':
                    return await handleToolsList( rpcRequest );
                case 'tools/call':
                    return await handleToolsCall( rpcRequest );
                default:
                    return null;
        }
    });
});

export default router;