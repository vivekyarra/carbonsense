const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db');
const jwt = require('jsonwebtoken');

let token;
let userId;

beforeAll(() => {
  db.prepare('DELETE FROM users').run();
  
  // Create a test user
  const res = db.prepare('INSERT INTO users (email, password_hash, name, daily_target_kg) VALUES (?, ?, ?, ?)').run('dash@example.com', 'hash', 'Dash User', 10);
  userId = res.lastInsertRowid;
  
  // Insert some test data
  db.prepare(`
    INSERT INTO activities (user_id, category, subcategory, quantity, unit, co2_kg, activity_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, 'transportation', 'car_petrol', 10, 'km', 1.92, new Date().toISOString().split('T')[0]);
  
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
});

afterAll(() => {
  db.prepare('DELETE FROM users').run();
});

describe('Dashboard API', () => {
  it('should get today score', async () => {
    const res = await request(app)
      .get('/api/dashboard/today')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('total_kg');
    expect(res.body.total_kg).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('breakdown');
  });

  it('should get weekly trend', async () => {
    const res = await request(app)
      .get('/api/dashboard/weekly')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('trend');
    expect(res.body.trend.length).toEqual(7);
  });

  it('should get monthly trend', async () => {
    const res = await request(app)
      .get('/api/dashboard/monthly')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('trend');
    expect(res.body.trend.length).toEqual(30);
  });

  it('should get overall stats', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user_daily_average_kg');
    expect(res.body).toHaveProperty('comparisons');
  });

  it('should get current and best streak', async () => {
    const res = await request(app)
      .get('/api/dashboard/streak')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('current_streak');
    expect(res.body).toHaveProperty('best_streak');
  });
});
