const request = require('supertest');
const app = require('../src/app');

describe('Health and root endpoints', () => {
  it('GET / should return welcome payload', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Welcome to Discord Messaging API',
    });
  });

  it('GET /api/v1/health should return backend health payload', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Backend is running');
    expect(typeof response.body.timestamp).toBe('string');
  });
});
