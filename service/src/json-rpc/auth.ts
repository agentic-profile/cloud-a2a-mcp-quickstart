import {
    b64u,
    ClientAgentSession,
    createChallenge,
    handleAuthorization,
} from "@agentic-profile/auth";
import {
    createDidResolver,
} from "@agentic-profile/common";
import { Request, Response } from 'express';
import { jrpcError, describeJsonRpcRequestError } from './utils';
import {
    clientAgentSessionStore,
    agenticProfileStore
} from '../stores/memory-store';
import { AGENTIC_AUTH_REQUIRED_JSON_RPC_CODE, JsonRpcMethodHandler, JsonRpcRequest, JsonRpcResponse } from "./types";

const didResolver = createDidResolver({ store: agenticProfileStore });

export async function processJsonRpcMethod(req: Request, res: Response, methodHandler: JsonRpcMethodHandler) {
    try {
        const rpcRequest = req.body as JsonRpcRequest;
        const { id, method } = rpcRequest;
    
        // Validate JSON-RPC request
        const requestError = describeJsonRpcRequestError( rpcRequest );
        if ( requestError ) {
            res.status(400).json( jrpcError( id || 'unknown', -32600, requestError ) );
            return;
        }

        // Are they providing an agentic session?
        let session: ClientAgentSession | null = null;
        const { authorization } = req.headers;
        if( authorization )
            session = await handleAuthorization( authorization, clientAgentSessionStore, didResolver );

        const result = await methodHandler( rpcRequest, session );
        if( result ) {
            // Error?
            if( 'error' in result ) {
                const { error } = result as JsonRpcResponse;
                if( error?.code === AGENTIC_AUTH_REQUIRED_JSON_RPC_CODE ) {
                    console.log('🔍 Auth required, creating challenge');
                    const challenge = await createChallenge( clientAgentSessionStore );

                    res.status(401)
                        .set('WWW-Authenticate', `Agentic ${b64u.objectToBase64Url(challenge)}`)
                        .json(result);
                    return;
                }

                // Other errors...
                const httpStatus = jsonRpcErrorCodeToHttpStatus(error?.code || 0);
                console.log(`🔍 Error code ${error?.code} => HTTP ${httpStatus}:`, result);
                res.status(httpStatus).json(result);
                return;
            }

            // Success response
            console.log('🔍 Success result:', result);
            res.json(result); // Return response as-is with 200 status
        } else {
            console.log('🔍 Result:', result);
            res.status(400).json( jrpcError( id!, -32601, `Method ${method} not found` ) );
        }
    } catch (error) {
        console.error('MCP method handler error:', error);
        res.status(500).json( jrpcError( req.body.id || 'unknown', -32603, `Internal error: ${error}` ) );
    }
}

function jsonRpcErrorCodeToHttpStatus(code: number): number {
    if( code >= -32099 && code <= -32000 )
        return 500;

    switch( code ) {
        case -32603:
            return 500; // Internal error
        case -32602:
            return 400; // Invalid params
        case -32601:
            return 400; // Method not found
        case -32600:
            return 400; // Invalid request  
        default:
            return 400;
    }
}