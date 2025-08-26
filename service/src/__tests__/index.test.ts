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

  describe('Lambda Integration', () => {
    it('should handle requests through serverless-express', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'GET',
        path: '/status',
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

      const result = await handler(event, mockContext, () => {});

      expect(result.statusCode).toBe(200);
      expect(result.headers).toHaveProperty('Content-Type', 'application/json');
      
      const body = JSON.parse(result.body || '{}');
      expect(body).toHaveProperty('status', 'healthy');
      expect(body).toHaveProperty('service', 'agentic-profile-mcp');
    });

    it('should handle MCP initialize request through Lambda', async () => {
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

      const result = await handler(event, mockContext, () => {});

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body || '{}');
      expect(body.jsonrpc).toBe('2.0');
      expect(body.id).toBe(1);
      expect(body.result).toHaveProperty('protocolVersion');
      expect(body.result).toHaveProperty('capabilities');
      expect(body.result).toHaveProperty('serverInfo');
    });

    it('should handle A2A endpoint requests through Lambda', async () => {
      const event: APIGatewayProxyEvent = {
        httpMethod: 'POST',
        path: '/a2a/hireme',
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        pathParameters: null,
        stageVariables: null,
        requestContext: {} as any,
        resource: '',
        body: JSON.stringify({
          id: 'task-1',
          method: 'tasks/send',
          params: {
            position: 'Senior Software Engineer',
          },
        }),
        isBase64Encoded: false,
      };

      const result = await handler(event, mockContext, () => {});

      expect(result.statusCode).toBe(200);
      expect(result.body).toBeDefined();
    });

    it('should handle malformed JSON gracefully in Lambda', async () => {
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

      const result = await handler(event, mockContext, () => {});

      expect(result.statusCode).toBe(500);
      expect(result.body).toBeDefined();
    });
  });
}); 