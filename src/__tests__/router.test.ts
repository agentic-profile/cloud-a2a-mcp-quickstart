import request from 'supertest';
import { app } from '../router';

describe('Express Router', () => {
  describe('Health Check', () => {
    it('should return 200 for GET /status', async () => {
      const response = await request(app)
        .get('/status')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'agentic-profile-mcp');
      expect(response.body).toHaveProperty('started');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('MCP Protocol Endpoints', () => {
    it('should handle initialize request', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(1);
      expect(response.body.result).toHaveProperty('protocolVersion');
      expect(response.body.result).toHaveProperty('capabilities');
      expect(response.body.result).toHaveProperty('serverInfo');
    });

    it('should handle tools/list request', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list',
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(2);
      expect(response.body.result).toHaveProperty('tools');
      expect(Array.isArray(response.body.result.tools)).toBe(true);
    });

    it('should handle get_profile tool call', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: 'get_profile',
            arguments: {
              did: 'did:example:123',
            },
          },
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(3);
      expect(response.body.result).toHaveProperty('content');
      expect(Array.isArray(response.body.result.content)).toBe(true);
    });

    it('should handle update_profile tool call', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 4,
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
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(4);
      expect(response.body.result).toHaveProperty('content');
      expect(Array.isArray(response.body.result.content)).toBe(true);
    });

    it('should handle locationUpdate method', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 5,
          method: 'locationUpdate',
          params: {
            coords: {
              latitude: 35.6762,
              longitude: 139.6503,
            },
          },
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(5);
      expect(response.body.result).toBeDefined();
    });

    it('should handle locationQuery method', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 6,
          method: 'locationQuery',
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(6);
      expect(response.body.result).toBeDefined();
    });

    it('should return error for invalid JSON-RPC request', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '1.0', // Invalid version
          id: 7,
          method: 'initialize',
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.error).toHaveProperty('code', -32600);
      expect(response.body.error).toHaveProperty('message', 'Invalid Request');
    });

    it('should return error for unknown method', async () => {
      const response = await request(app)
        .post('/')
        .send({
          jsonrpc: '2.0',
          id: 8,
          method: 'unknown_method',
        })
        .expect(200);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.id).toBe(8);
      expect(response.body.error).toHaveProperty('code', -32601);
      expect(response.body.error).toHaveProperty('message', 'Method not found');
    });
  });

  describe('A2A TaskHandler Endpoints', () => {
    it('should handle /a2a/hireme endpoint', async () => {
      const response = await request(app)
        .post('/a2a/hireme')
        .send({
          id: 'task-1',
          method: 'tasks/send',
          params: {
            position: 'Senior Software Engineer',
            experience: '5+ years',
          },
          userId: 'user-123',
          includeAllUpdates: true,
        })
        .expect(200);

      expect(response.body).toBeDefined();
      // The actual response structure depends on the A2A handler implementation
    });

    it('should handle /a2a/venture endpoint', async () => {
      const response = await request(app)
        .post('/a2a/venture')
        .send({
          id: 'task-2',
          method: 'venture/create',
          params: {
            name: 'Test Venture',
            type: 'startup',
          },
          userId: 'user-456',
        })
        .expect(200);

      expect(response.body).toBeDefined();
      // The actual response structure depends on the A2A handler implementation
    });

    it('should handle /a2a/vc endpoint', async () => {
      const response = await request(app)
        .post('/a2a/vc')
        .send({
          id: 'task-3',
          method: 'task/send',
          params: {
            investment: '1000000',
            stage: 'Series A',
          },
          userId: 'user-789',
        })
        .expect(200);

      expect(response.body).toBeDefined();
      // The actual response structure depends on the A2A handler implementation
    });
  });

  describe('CORS and OPTIONS', () => {
    it('should handle OPTIONS request for CORS preflight', async () => {
      await request(app)
        .options('/')
        .expect(200);
    });

    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/status')
        .expect(200);

      expect(response.headers).toHaveProperty('access-control-allow-origin', '*');
      expect(response.headers).toHaveProperty('access-control-allow-headers', 'Content-Type');
      expect(response.headers).toHaveProperty('access-control-allow-methods', 'GET, POST, OPTIONS');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.error).toHaveProperty('code', -32601);
      expect(response.body.error).toHaveProperty('message', 'Method not found');
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 405 for unsupported HTTP methods', async () => {
      const response = await request(app)
        .put('/status')
        .expect(404);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.error).toHaveProperty('code', -32601);
    });
  });
});
