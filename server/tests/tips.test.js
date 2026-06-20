const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db');
const jwt = require('jsonwebtoken');

let token;
let userId;

beforeAll(() => {
  db.prepare('DELETE FROM users').run();
  
  const res = db.prepare('INSERT INTO users (email, password_hash, name, daily_target_kg) VALUES (?, ?, ?, ?)').run('tips@example.com', 'hash', 'Tips User', 10);
  userId = res.lastInsertRowid;
  
  // Create some tips
  db.prepare('DELETE FROM tips').run();
  db.prepare('INSERT INTO tips (category, title, description, potential_saving_kg) VALUES (?, ?, ?, ?)').run('transportation', 'Tip 1', 'Desc 1', 5);
  db.prepare('INSERT INTO tips (category, title, description, potential_saving_kg) VALUES (?, ?, ?, ?)').run('food', 'Tip 2', 'Desc 2', 2);
  
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
});

afterAll(() => {
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM tips').run();
});

describe('Tips API', () => {
  it('should get all tips', async () => {
    const res = await request(app)
      .get('/api/tips/all')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.tips).toBeInstanceOf(Array);
    expect(res.body.tips.length).toBeGreaterThanOrEqual(2);
  });

  it('should get personalized tips', async () => {
    const res = await request(app)
      .get('/api/tips')
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.tips).toBeInstanceOf(Array);
  });

  it('should save a tip', async () => {
    // Get tip ID
    const tipsRes = await request(app).get('/api/tips/all').set('Authorization', `Bearer ${token}`);
    const tipId = tipsRes.body.tips[0].id;
    
    const res = await request(app)
      .post(`/api/tips/${tipId}/save`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/saved/);
  });

  it('should unsave a tip', async () => {
    const tipsRes = await request(app).get('/api/tips/all').set('Authorization', `Bearer ${token}`);
    const tipId = tipsRes.body.tips[0].id;
    
    const res = await request(app)
      .delete(`/api/tips/${tipId}/save`)
      .set('Authorization', `Bearer ${token}`);
      
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toMatch(/unsaved/);
  });
});
