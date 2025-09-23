import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { itemStore } from '../../stores/dynamodb-store.js';
import { jrpcResult, jrpcError } from '../../json-rpc/index.js';
import { MCP_TOOLS } from './tools.js';
import { ClientAgentSession } from '@agentic-profile/auth';
import { mcpCrud } from '../mcp-crud.js';
import { ReputationItem } from './types.js';
import { mcpResultResponse, resolveAgentDid } from '../utils.js';
//import { presentCredential } from './present.js';

const TABLE_NAME = process.env.DYNAMODB_REPUTATIONS_TABLE_NAME || 'reputations';
const store = itemStore<ReputationItem>({name: 'reputations', 'tableName': TABLE_NAME});
function idResolver(item: ReputationItem | undefined, session: ClientAgentSession, params: any | undefined ): string {
    const key = item?.key ?? params?.key;
    return `${resolveAgentDid(session).did}^${key}`;
}
function authorResolver(_item: ReputationItem | undefined, session: ClientAgentSession, _params: any | undefined ): string | undefined {
    return resolveAgentDid(session).did;
}
const crud = mcpCrud(store, { idResolver, authorResolver, authorKey: 'reporterDid' } );

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
        case 'list-by-reporter':
            return await handleListByReporter(request, session);
        case 'list-by-subject':
            return await handleListBySubject(request, session);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

// List all the reputations I've reported
export async function handleListByReporter(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    try {
        const reporterDid = resolveAgentDid(session).did;
        const query = {
            KeyConditionExpression: "reporterDid = :reporterDid",
            ExpressionAttributeValues: { ":reporterDid": reporterDid }
        };
        const items = await store.queryItems(query);

        return mcpResultResponse(request.id!, { items });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to list reputation items by reporter: ${(error as Error).message}`);
    }
}

// Get all the reputation items about a subject
export async function handleListBySubject(request: JSONRPCRequest, _session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { subjectDid } = request.params || {};
    try {
        const query = {
            KeyConditionExpression: "subjectDid = :subjectDid",
            ExpressionAttributeValues: { ":subjectDid": subjectDid }
        };
        const items = await store.queryItems(query);

        return mcpResultResponse(request.id!, { items });
    } catch (error) {
        return jrpcError(request.id!, -32603, `Failed to list reputation items by subject: ${(error as Error).message}`);
    }
}
