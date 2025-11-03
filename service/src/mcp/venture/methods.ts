import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { jrpcError, jrpcResult } from '../../json-rpc/index.js';
import { resolveAgentId } from '../../json-rpc/utils.js';

import { ClientAgentSession } from '@agentic-profile/auth';
import { StoreItem } from '../../stores/types.js';
import { mcpCrud } from '../mcp-crud.js';
import { handleAbout, handleRecentUpdates } from '../mcp-misc.js';
import { Request } from 'express';

const TABLE_NAME = process.env.DYNAMODB_VENTURE_PROFILES_TABLE_NAME || 'venture-profiles';
const store = itemStore<StoreItem>({'tableName': TABLE_NAME});

const KINDS = [ 'venture' , 'capital', 'venture-strategy' ]; // TODO refine this

function idResolver(item: StoreItem | undefined, session: ClientAgentSession, params: any | undefined ): string {
    const kind = item?.kind ?? params?.kind;
    if( !KINDS.includes(kind) )
        throw new Error(`Invalid kind: ${kind}`);
    return `${resolveAgentId(session).did}^${kind}`;
}

function authorResolver(_item: StoreItem | undefined, session: ClientAgentSession, _params: any | undefined ): string {
    return resolveAgentId(session).did;
}

const crud = mcpCrud(store, { idResolver, itemKey: "profile", authorResolver, authorKey: "subjectDid" } );

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession, req: Request): Promise<JSONRPCResponse | JSONRPCError> {
    const { name } = request.params || {};

    console.log('🔍 handleToolsCall', name, request, session);
    
    switch (name) {
        case 'read':
            return await crud.handleRead(request,session);
        case 'update':
            return await crud.handleUpdate(request,session);
        case 'delete':
            return await crud.handleDelete(request,session);
        case 'about':
            return await handleAbout(request,store);
        case 'recent-updates':
            return await handleRecentUpdates(request,store);
        case 'subscribe-to-agent':
            return await handleSubscribeToAgent(request,session,req);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

interface SubscribeToAgentPayload {
    context: any;
    mcp: string;
}

async function handleSubscribeToAgent(request: JSONRPCRequest, session: ClientAgentSession, req: Request): Promise<JSONRPCResponse | JSONRPCError> {
    //console.log('🔍 handleSubscribeToAgent', request, session);

    const payload = request.params?.arguments as SubscribeToAgentPayload;

    // Store agent we are handling requests for
    const updateResult = await crud.handleUpdate({
        params: {
            arguments: {
                profile: {
                    kind: 'venture',
                    ...payload.context
                }
            }
        }
    } as any, session);

    console.log( '🔍 updateResult', updateResult );
    if( 'error' in updateResult )
        return updateResult;

    // return agent service to be baked into the agentic profile
    const host = req.headers.host || 'localhost';
    const protocol = req.protocol || 'https';
    
    // Parse host to extract hostname and port for DID construction
    const [hostname, portStr] = host.split(':');
    const port = portStr && portStr !== '443' ? `%3A${portStr}` : '';
    
    const service = {
        id: '#venture',
        name: 'Venture Agent',
        type: 'A2A/venture',
        serviceEndpoint: `${protocol}://${host}/a2a/venture`,
        capabilityInvocation: [`did:web:${hostname}${port}#system-key`]
    };

    return jrpcResult(request.id!, { service });
}
