const request = require('supertest');
const app = require('../src/app');
const { parseAllowedOrigins, positiveInteger } = require('../src/config/env');
const { sanitizeInput } = require('../src/middleware/sanitize');

describe('Security and runtime boundaries', () => {
  it('normalizes allowed origins and numeric configuration', () => {
    expect(parseAllowedOrigins(' https://example.com/path ,http://localhost:5173 ')).toEqual([
      'https://example.com',
      'http://localhost:5173',
    ]);
    expect(positiveInteger('25', 10)).toBe(25);
    expect(positiveInteger('-1', 10)).toBe(10);
  });

  it('sanitizes nested request data without preserving dangerous keys', () => {
    const input = JSON.parse('{"name":"  Test  ","nested":{"$where":"bad","safe":" ok "},"__proto__":{"polluted":true}}');
    expect(sanitizeInput(input)).toEqual({
      name: 'Test',
      nested: { safe: 'ok' },
    });
    expect({}.polluted).toBeUndefined();
  });

  it('provides a health endpoint with security headers and request tracing', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('returns a structured 404 response', async () => {
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Route not found',
      requestId: response.headers['x-request-id'],
    });
  });

  it('rejects untrusted CORS and cookie-auth request origins', async () => {
    const corsResponse = await request(app)
      .get('/health')
      .set('Origin', 'https://attacker.example');
    expect(corsResponse.status).toBe(403);

    const refreshResponse = await request(app)
      .post('/api/auth/refresh')
      .set('Origin', 'https://attacker.example');
    expect(refreshResponse.status).toBe(403);
    expect(refreshResponse.body.message).toBe('Origin is not allowed');
  });
});
