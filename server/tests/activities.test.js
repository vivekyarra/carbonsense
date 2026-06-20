const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db');
const jwt = require('jsonwebtoken');

let token;
let userId;
let activityId;

beforeAll(() => {
  db.prepare('DELETE FROM users').run();
  
  // Create a test user
  const res = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run('activity@example.com', 'hash', 'Activity User');
  userId = res.lastInsertRowid;
  
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
});

afterAll(() => {
  db.prepare('DELETE FROM users').run();
});

describe('Activities API', () => {
  it('should create an activity successfully', async () => {
    const res = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'transportation',
        subcategory: 'car_petrol',
        quantity: 10,
        unit: 'km',
        activity_date: '2023-10-25'
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body.activity).toHaveProperty('id');
    expect(res.body.activity.co2_kg).toBeGreaterThan(0);
    activityId = res.body.activity.id;
  });

  it('should fail to create activity with invalid data', async () => {
    const res = await request(app)
      .post('/api/activities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        category: 'invalid_category',
        subcategory: 'car_petrol',
        quantity: -5,
        unit: 'km',
        activity_date: 'invalid-date'
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .post('/api/activities')
      .send({
        category: 'food',
        subcategory: 'beef',
        quantity: 1,
        unit: 'meal',
        activity_date: '2023-10-25'
      });
      
    expect(res.statusCode).toEqual(401);
  });

  it('should get activities with pagination', async () => {
    const res = await request(app)
      .get('/api/activities?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a single activity', async () => {
    const res = await request(app)
      .get(`/api/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.activity.id).toEqual(activityId);
  });

  it('should update an activity', async () => {
    const res = await request(app)
      .put(`/api/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        quantity: 20
      });
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.activity.quantity).toEqual(20);
  });

  it('should delete an activity', async () => {
    const res = await request(app)
      .delete(`/api/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    
    // Verify deletion
    const getRes = await request(app)
      .get(`/api/activities/${activityId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toEqual(404);
  });
});
