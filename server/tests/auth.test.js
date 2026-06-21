const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db');
const { createUser } = require('../src/models/userModel');

// Ensure db is cleaned up
beforeAll(() => {
  db.prepare('DELETE FROM users').run();
});

afterAll(() => {
  db.prepare('DELETE FROM users').run();
  db.close();
});

describe('Auth API', () => {
  let token;
  const testUser = {
    email: 'testauth@example.com',
    password: 'Password123!',
    name: 'Test Auth User'
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should not register with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toMatch(/already exists/);
  });

  it('should fail registration with invalid input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'notanemail', password: 'short', name: '' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
    token = res.body.accessToken;
    
    // Check if refreshToken cookie is set
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/refreshToken/);
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    
    expect(res.statusCode).toEqual(401);
  });

  it('should fail login with nonexistent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password123!' });
    
    expect(res.statusCode).toEqual(401);
  });

  it('should get current user profile with token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('email', testUser.email);
  });

  it('should refresh token using cookie', async () => {
    // We need to login again to capture the cookie properly
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    
    const cookie = loginRes.headers['set-cookie'];
    
    const res = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookie);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('should fail refresh if no token', async () => {
    const res = await request(app).post('/api/auth/refresh');
    expect(res.statusCode).toEqual(401);
  });

  it('should update daily target', async () => {
    const res = await request(app)
      .put('/api/auth/target')
      .set('Authorization', `Bearer ${token}`)
      .send({ target: 15 });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toHaveProperty('daily_target_kg', 15);
  });

  it('should logout user', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.headers['set-cookie'][0]).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/);
  });
});
