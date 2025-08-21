import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { handleJsonRPCRequest } from './router';

const CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    console.log('🚀 Lambda handler started');
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));

    try {
        // Parse the request body
        console.log('🔍 Parsing request body...');
        const body = event.body ? JSON.parse(event.body) : {};
        console.log('🔍 Request body:', JSON.stringify(body, null, 2));
        
        // Handle different HTTP methods
        console.log(`🔍 HTTP method: ${event.httpMethod}`);
        switch (event.httpMethod) {
            case 'POST':
                console.log('🔍 Handling POST request...');
                return await handleJsonRPCRequest(body, event);
            case 'GET':
                return await handleHealthCheck();
            default:
                return {
                    statusCode: 405,
                    headers: CORS_HEADERS,
                    body: JSON.stringify({
                        error: 'Method not allowed'
                    })
                };
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};

async function handleHealthCheck(): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'agentic-profile-mcp'
        })
    };
} 