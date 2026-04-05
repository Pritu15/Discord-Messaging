const request = require('supertest');

jest.mock('../src/services/auth.service', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  logoutUser: jest.fn(),
}));

const authService = require('../src/services/auth.service');
const app = require('../src/app');

describe('Auth endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/v1/auth/login should return 400 for invalid input', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
    expect(response.body.errors).toMatchObject({
      identifier: expect.any(String),
      password: expect.any(String),
    });
  });

  it('POST /api/v1/auth/login should return 200 for valid credentials', async () => {
    authService.loginUser.mockResolvedValue({
      token: 'fake-token',
      tokenType: 'Bearer',
      expiresAt: '2099-01-01T00:00:00.000Z',
      user: {
        id: 1,
        email: 'test@example.com',
        username: 'tester',
      },
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifier: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data.token).toBe('fake-token');
    expect(authService.loginUser).toHaveBeenCalledWith({
      identifier: 'test@example.com',
      password: 'password123',
    });
  });

  it('POST /api/v1/auth/login should return 401 when service throws auth error', async () => {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    authService.loginUser.mockRejectedValue(error);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ identifier: 'tester', password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Invalid credentials',
    });
  });
});
