import request from 'supertest';
import { app } from '../router';
import path from 'path';
import fs from 'fs';

describe('Static File Serving', () => {
  const wwwPath = path.join(__dirname, '../../www');

  beforeAll(() => {
    // Ensure www directory exists
    if (!fs.existsSync(wwwPath)) {
      fs.mkdirSync(wwwPath, { recursive: true });
    }
  });

  describe('Static Files', () => {
    it('should serve index.html from www directory', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Agentic Profile MCP Service');
      expect(response.text).toContain('Available Endpoints');
    });

    it('should serve CSS files', async () => {
      const response = await request(app)
        .get('/styles.css')
        .expect(200);

      expect(response.text).toContain('body {');
      expect(response.text).toContain('background: linear-gradient');
    });

    it('should serve JavaScript files', async () => {
      const response = await request(app)
        .get('/script.js')
        .expect(200);

      expect(response.text).toContain('testHealth');
      expect(response.text).toContain('testInitialize');
      expect(response.text).toContain('testHireMe');
    });

    it('should set correct content type for HTML files', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/html');
    });

    it('should set correct content type for CSS files', async () => {
      const response = await request(app)
        .get('/styles.css')
        .expect(200);

      expect(response.headers['content-type']).toContain('text/css');
    });

    it('should set correct content type for JavaScript files', async () => {
      const response = await request(app)
        .get('/script.js')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/javascript');
    });
  });

  describe('404 Handling for Static Files', () => {
    it('should return 404 for non-existent static files', async () => {
      const response = await request(app)
        .get('/non-existent-file.css')
        .expect(404);

      expect(response.body.jsonrpc).toBe('2.0');
      expect(response.body.error).toHaveProperty('code', -32601);
      expect(response.body.error).toHaveProperty('message', 'Method not found');
    });
  });

  describe('Web Interface Content', () => {
    it('should display all API endpoints in the web interface', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const html = response.text;
      
      // Check for endpoint information
      expect(html).toContain('/status');
      expect(html).toContain('/a2a/hireme');
      expect(html).toContain('/a2a/venture');
      expect(html).toContain('/a2a/vc');
      
      // Check for testing buttons
      expect(html).toContain('Test Health Check');
      expect(html).toContain('Test MCP Initialize');
      expect(html).toContain('Test HireMe A2A');
    });

    it('should include proper meta tags and title', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const html = response.text;
      
      expect(html).toContain('<title>Agentic Profile MCP Service</title>');
      expect(html).toContain('charset="UTF-8"');
      expect(html).toContain('viewport');
    });
  });
});
