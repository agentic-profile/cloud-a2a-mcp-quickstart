import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { handler } from '../index';

describe('Lambda Handler', () => {
  const mockContext: Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: 'test-function',
    functionVersion: '1',
    invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
    memoryLimitInMB: '128',
    awsRequestId: 'test-request-id',
    logGroupName: '/aws/lambda/test-function',
    logStreamName: '2023/01/01/[$LATEST]test-stream',
    getRemainingTimeInMillis: () => 1000,
    done: jest.fn(),
    fail: jest.fn(),
    succeed: jest.fn(),
  };

  describe('Health Check', () => {
    it('should return 200 for GET request', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'GET',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: null,
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(200);
      expect(result.headers).toHaveProperty('Content-Type', 'application/json');
      
      const body = JSON.parse(result.body || '{}');
      expect(body).toHaveProperty('status', 'healthy');
      expect(body).toHaveProperty('service', 'agentic-profile-mcp');
    });
  });

  describe('MCP Protocol', () => {
    it('should handle initialize request', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.id).toBe(1);
      expect(body.result).toHaveProperty('protocolVersion');
      expect(body.result).toHaveProperty('capabilities');
      expect(body.result).toHaveProperty('serverInfo');
    });

    it('should handle tools/list request', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list',
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.id).toBe(1);
      expect(body.result).toHaveProperty('tools');
      expect(Array.isArray(body.result.tools)).toBe(true);
    });

    it('should handle get_profile tool call', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'get_profile',
            arguments: {
              did: 'did:example:123',
            },
          },
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.id).toBe(1);
      expect(body.result).toHaveProperty('content');
      expect(Array.isArray(body.result.content)).toBe(true);
    });

    it('should handle update_profile tool call', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'update_profile',
            arguments: {
              did: 'did:example:123',
              profile: {
                name: 'Updated Profile',
                description: 'Updated description',
              },
            },
          },
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.id).toBe(1);
      expect(body.result).toHaveProperty('content');
      expect(Array.isArray(body.result.content)).toBe(true);
    });

    it('should return error for invalid JSON-RPC request', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          jsonrpc: '1.0', // Invalid version
          id: 1,
          method: 'initialize',
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(400);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.error).toHaveProperty('code', -32600);
      expect(body.error).toHaveProperty('message', 'Invalid Request');
    });

    it('should return error for unknown method', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'unknown_method',
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.id).toBe(1);
      expect(body.error).toHaveProperty('code', -32601);
      expect(body.error).toHaveProperty('message', 'Method not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: 'invalid json',
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(500);
      
      const body = JSON.parse(result.body || '{}');
      expect(body).toHaveProperty('error', 'Internal server error');
    });

    it('should return 405 for unsupported HTTP method', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'PUT',
        path: '/',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: null,
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext);

      expect(result.statusCode).toBe(405);
      
      const body = JSON.parse(result.body || '{}');
      expect(body).toHaveProperty('error', 'Method not allowed');
    });
  });
}); 