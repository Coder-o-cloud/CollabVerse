const request = require('supertest');
const app = require('../../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('Role-based Access Control', () => {
  jest.setTimeout(15000); // Increase timeout to 15 seconds
  let adminToken, teacherToken, studentToken;
  let adminUser, teacherUser, studentUser;

  beforeAll(async () => {
    // Create test users with different roles
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // Create admin user
    adminUser = new User({
      name: 'Admin User',
      email: 'admin@test.com',
      passwordHash,
      college: 'Test University',
      role: 'admin'
    });
    await adminUser.save();

    // Create teacher user
    teacherUser = new User({
      name: 'Teacher User',
      email: 'teacher@test.com',
      passwordHash,
      college: 'Test University',
      role: 'teacher'
    });
    await teacherUser.save();

    // Create student user
    studentUser = new User({
      name: 'Student User',
      email: 'student@test.com',
      passwordHash,
      college: 'Test University',
      role: 'student'
    });
    await studentUser.save();

    // Get tokens for each user
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminRes.body.token;

    const teacherRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teacher@test.com', password: 'password123' });
    teacherToken = teacherRes.body.token;

    const studentRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@test.com', password: 'password123' });
    studentToken = studentRes.body.token;
  });

  afterAll(async () => {
    // Clean up test users
    await User.deleteMany({
      email: { $in: ['admin@test.com', 'teacher@test.com', 'student@test.com'] }
    });
  });

  it('should allow admin to access admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should deny teacher access to admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(403);
    
    expect(res.body.message).toContain('Access denied');
  });

  it('should deny student access to admin routes', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
    
    expect(res.body.message).toContain('Access denied');
  });

  it('should allow teacher to access teacher routes', async () => {
    const res = await request(app)
      .get('/api/teacher/projects')
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should deny admin access to teacher routes', async () => {
    const res = await request(app)
      .get('/api/teacher/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(403);
    
    expect(res.body.message).toContain('Access denied');
  });

  it('should deny student access to teacher routes', async () => {
    const res = await request(app)
      .get('/api/teacher/projects')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
    
    expect(res.body.message).toContain('Access denied');
  });

  it('should allow student to access student routes', async () => {
    const res = await request(app)
      .get('/api/student/projects')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);
    
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should deny admin access to student routes', async () => {
    const res = await request(app)
      .get('/api/student/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(403);
    
    expect(res.body.message).toContain('Access denied');
  });

  it('should deny teacher access to student routes', async () => {
    const res = await request(app)
      .get('/api/student/projects')
      .set('Authorization', `Bearer ${teacherToken}`)
      .expect(403);
    
    expect(res.body.message).toContain('Access denied');
  });
});