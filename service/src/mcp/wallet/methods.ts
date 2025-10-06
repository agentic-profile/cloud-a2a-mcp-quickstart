/**
 * https://www.w3.org/TR/vc-overview/
 */

import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { jrpcResult, jrpcError } from '../../json-rpc/index.js';
import { MCP_TOOLS } from './tools.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { mcpCrud } from '../mcp-crud.js';
import { WalletItem } from './types.js';
import { mcpResultResponse } from '../misc.js';
import { resolveAgentId } from '../../json-rpc/utils.js';
import { presentCredential } from './present.js';

const TABLE_NAME = process.env.DYNAMODB_WALLETS_TABLE_NAME || 'wallets';
const store = itemStore<WalletItem>({tableName: TABLE_NAME});
function idResolver(item: WalletItem | undefined, session: ClientAgentSession, params: any | undefined ): string {
    const key = item?.key ?? params?.key;
    return `${resolveAgentId(session).did}^${key}`;
}
function authorResolver(_item: WalletItem | undefined, session: ClientAgentSession, _params: any | undefined ): string | undefined {
    return resolveAgentId(session).did;
}
const crud = mcpCrud(store, { idResolver, authorResolver, authorKey: 'ownerDid' } );

export async function handleToolsList(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    return jrpcResult(request.id!, { tools: MCP_TOOLS } ) as JSONRPCResponse;
}

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { name } = request.params || {};

    console.log('🔍 handleToolsCall', name, session);
    
    switch (name) {
        case 'read':
            return await crud.handleRead(request,session);
        case 'update':
            return await crud.handleUpdate(request,session);
        case 'delete':
            return await crud.handleDelete(request,session);
        case 'present':
            return await handlePresent(request, session);
        case 'list':
            return await handleList(request, session);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

export async function handlePresent(request: JSONRPCRequest, _session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { subjectDid, key } = request.params || {};
    
    if (!key) {
        return jrpcError(request.id!, -32602, 'Invalid params: key is required');
    }
    if(!subjectDid) {
        return jrpcError(request.id!, -32602, 'Invalid params: subjectDid is required');
    }

    // Use the same ID resolver as the CRUD operations
    const id = `${subjectDid}^${key}`;
    
    try {
        // Read the wallet item
        const walletItem = await store.readItem(id);
        
        if (!walletItem) {
            return jrpcError(request.id!, -32604, `Wallet item with key '${key}' not found`);
        }
        if( walletItem.public != true ) {
            return jrpcError(request.id!, -32604, `Wallet item with key '${key}' is not public`);
        }

        const { credential } = walletItem;
        const presentation = credential.proof ? credential : await presentCredential( credential );

        return mcpResultResponse(request.id!, { presentation });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to present credential: ${(error as Error).message}`);
    }
}

export async function handleList(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    try {
        // Get all MY wallet items using the Global Secondary Index
        const ownerDid = resolveAgentId(session).did;
        const query = {
            IndexName: "OwnerIndex",
            KeyConditionExpression: "ownerDid = :ownerDid",
            ExpressionAttributeValues: { ":ownerDid": ownerDid }
        };
        const items = await store.queryItems(query);

        return mcpResultResponse(request.id!, { items });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to list wallet items: ${(error as Error).message}`);
    }
}
