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
import { mcpResultResponse } from '../utils.js';

const TABLE_NAME = process.env.DYNAMODB_WALLET_TABLE_NAME || 'wallets';
const store = itemStore<WalletItem>({name: 'wallets', 'tableName': TABLE_NAME});
function idResolver(item: WalletItem | undefined, session: ClientAgentSession, params: any | undefined ): string {
    const key = item?.key ?? params?.key;
    return `${session.agentDid.split('#')[0]}^${key}`;
}
function ownerResolver(_item: WalletItem | undefined, session: ClientAgentSession, _params: any | undefined ): string | undefined {
    return session.agentDid.split('#')[0];
}
const crud = mcpCrud(store, { idResolver, ownerResolver } );

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

export async function handlePresent(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { key } = request.params || {};
    
    if (!key) {
        return jrpcError(request.id!, -32602, 'Invalid params: key is required');
    }

    // Use the same ID resolver as the CRUD operations
    const id = idResolver(undefined, session, { key });
    
    try {
        // Read the wallet item
        const walletItem = await store.readItem(id);
        
        if (!walletItem) {
            return jrpcError(request.id!, -32604, `Wallet item with key '${key}' not found`);
        }

        // Present the credential - return the credential data along with presentation metadata
        const presentation = {
            type: 'VerifiablePresentation',
            presentedAt: new Date().toISOString(),
            presentedBy: session.agentDid.split('#')[0],
            credential: walletItem.credential,
            walletKey: key
        };

        return mcpResultResponse(request.id!, { presentation });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to present credential: ${(error as Error).message}`);
    }
}

export async function handleList(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    try {
        // Get all wallet items
        const allItems = await store.queryItems();
        
        // Filter by owner (agent DID)
        const ownerPrefix = session.agentDid.split('#')[0];
        const userItems = allItems.filter(item => item.owner === ownerPrefix);
        
        // Return list of wallet items with keys and basic info
        const itemList = userItems.map(item => ({
            key: item.key,
            id: item.id,
            updated: item.updated,
            hasCredential: !!item.credential
        }));

        return mcpResultResponse(request.id!, { 
            items: itemList,
            count: itemList.length 
        });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to list wallet items: ${(error as Error).message}`);
    }
}

/*
export async function handleLocationQuery(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const userDid = "did:web:iamagentic.ai:1";
    const locationKey = `location:${userDid}`;
    
    try {
        const locationData = await getValue(locationKey);
        
        if (!locationData) {
            return jrpcError(request.id!, -32604, 'No location data found for user');
        }

        const { longitude, latitude } = locationData;
        return mcpTextContentResponse(request.id!, `Location: ${longitude}, ${latitude}`);
    } catch (error) {
        console.log('🔍 getValue failed, using fallback:', error);
        return jrpcError(request.id!, -32603, 'Location data unavailable (Redis connection issue)');
    }
}
*/