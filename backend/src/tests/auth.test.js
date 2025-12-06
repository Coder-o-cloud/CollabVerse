const request = require('supertest');
const app = require('../../app');
const User = require('../models/User');

describe('Auth API', () => {
  jest.setTimeout(10000); // Increase timeout to 10 seconds
  beforeEach(async () => {
    // Clear test users before each test
    await User.deleteMany({ email: { $in: ['test@example.com', 'teacher@example.com', 'admin@example.com'] } });
  });

  it('should register a new user with default student role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        college: 'Test University'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.name).toBe('Test User');
    expect(res.body.user.role).toBe('student');
  });

  it('should register a user with teacher role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Teacher User',
        email: 'teacher@example.com',
        password: 'password123',
        college: 'Test University',
        role: 'teacher'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.user.role).toBe('teacher');
  });

  it('should register a user with admin role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        college: 'Test University',
        role: 'admin'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.user.role).toBe('admin');
  });

  it('should reject invalid role', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Invalid User',
        email: 'invalid@example.com',
        password: 'password123',
        college: 'Test University',
        role: 'invalid_role'
      });
    
    expect(res.statusCode).toEqual(400);
  });

  it('should login an existing user', async () => {
    // First register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        college: 'Test University'
      });

    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
  });
});