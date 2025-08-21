import { createServer, IncomingMessage, ServerResponse } from 'http';
import { handler } from './index';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const PORT = process.env.PORT || 3000;

// Convert Node.js HTTP request to Lambda event format
function createLambdaEvent(req: IncomingMessage, body: string): APIGatewayProxyEvent {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    
    return {
        httpMethod: req.method || 'GET',
        path: url.pathname,
        pathParameters: null,
        queryStringParameters: Object.fromEntries(url.searchParams.entries()),
        multiValueQueryStringParameters: {},
        headers: req.headers as Record<string, string>,
        multiValueHeaders: {},
        body: body || null,
        isBase64Encoded: false,
        requestContext: {
            accountId: 'local',
            apiId: 'local',
            authorizer: {},
            httpMethod: req.method || 'GET',
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                clientCert: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null,
                sourceIp: req.socket.remoteAddress || '127.0.0.1',
                user: null,
                userAgent: req.headers['user-agent'] || null,
                userArn: null
            },
            path: url.pathname,
            protocol: 'HTTP/1.1',
            requestId: 'local-' + Date.now(),
            requestTime: new Date().toISOString(),
            requestTimeEpoch: Date.now(),
            resourceId: 'local',
            resourcePath: url.pathname,
            stage: 'local'
        },
        resource: url.pathname,
        stageVariables: null
    };
}

// Convert Lambda response to Node.js HTTP response
function sendLambdaResponse(res: ServerResponse, lambdaResult: any) {
    res.writeHead(lambdaResult.statusCode, lambdaResult.headers);
    res.end(lambdaResult.body);
}

// Create HTTP server
const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    console.log(`🌐 Local server received ${req.method} request to ${req.url}`);
    
    try {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            });
            res.end();
            return;
        }

        // Read request body
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                // Create Lambda context
                const context: Context = {
                    callbackWaitsForEmptyEventLoop: false,
                    functionName: 'local-agentic-profile-mcp',
                    functionVersion: 'local',
                    invokedFunctionArn: 'local',
                    memoryLimitInMB: '128',
                    awsRequestId: 'local-' + Date.now(),
                    logGroupName: 'local',
                    logStreamName: 'local',
                    getRemainingTimeInMillis: () => 30000,
                    done: () => {},
                    fail: () => {},
                    succeed: () => {}
                };

                // Convert request to Lambda event
                const event = createLambdaEvent(req, body);
                
                // Call the Lambda handler
                const result = await handler(event, context);
                
                // Send response back to client
                sendLambdaResponse(res, result);
                
            } catch (error) {
                console.error('Error in request handler:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                }));
            }
        });

    } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Local HTTP server started on port ${PORT}`);
    console.log(`📡 Server endpoint: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/`);
    console.log(`📝 POST requests will be proxied to the Lambda handler`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down local server...');
    server.close(() => {
        console.log('✅ Local server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down local server...');
    server.close(() => {
        console.log('✅ Local server stopped');
        process.exit(0);
    });
});
