import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from "@modelcontextprotocol/sdk/types.js";
import { mcpResultResponse } from "../misc.js";
import { jrpcError } from "../../json-rpc/index.js";
import { chatCompletion } from '../../inference/claude-bedrock.js';
import { extractJson } from '../../utils/json.js';
import { readFileSync } from 'fs';

const SYSTEM_PROMPT = readFileSync(new URL('prompt.txt', import.meta.url), 'utf-8');

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatQuery {
    messages: Message[]
}

export async function handleChat(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const query = request.params?.arguments as ChatQuery | undefined;
    if( !query )
        return jrpcError(request.id!, -32602, `Invalid arguments: query is required`);

    const { messages } = query;
    if( !messages )
        return jrpcError(request.id!, -32602, `Invalid arguments: message is required`);

    const options = {
        system: SYSTEM_PROMPT,
        messages
    };
    let text = await chatCompletion(options) as string;

    const { jsonObjects, textWithoutJson } = extractJson(text);
    if( jsonObjects?.length > 0 ) {
        return mcpResultResponse(request.id!, {
            kind: 'message',
            content: textWithoutJson,
            metadata: {
                jsonObjects 
            }
        });
    }

    return mcpResultResponse(request.id!, {
        kind: 'message',
        content: text
    });
}

/*
const SYSTEM_PROMPT = `You are a helpful assistant talking with a user who wants to volunteer
for community activities in the UK.

Your primary task is to ask questions that help build a filter to find activities that match the user's criteria.

The filter must conform to the following schema:

<Filter>
export type Filter = {
    kind: 'filter';
    keywords?: string;  // keywords to search for
    postcode?: string; // The UK postcode to search for activities within
    startDate?: string; // A date in ISO 8601 format
    endDate?: string; // A date in ISO 8601 format
    attendanceType?: 'Home' | 'Local'; // whether the activity can be done from home, or must be at a local place
};
</Filter>

CRITICAL INSTRUCTION:

- Only ask questions that help build or refine the filter.
- Immediately after the user provides any information that can be added to or update the filter, you must do two things:
  1. Provide your conversational response/next question.
  2. Append a complete and updated JSON filter object to your response.

Filter Output Format:

The JSON filter must be provided in the following format, which must wrap the standard JSON:

<JSONResult>
{
    "kind": "filter",
    "keywords": "london",
    "postcode": "E1 3DG",
    "startDate": "2025-12-01",
    "endDate": "2025-12-31",
    "attendanceType": "Local"
}
</JSONResult>

It is very important to only ask questions that help build the filter.

`;
*/
