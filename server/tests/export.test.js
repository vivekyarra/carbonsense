const request = require('supertest');
const app = require('../src/app');
const db = require('../src/models/db');
const { createUser } = require('../src/models/userModel');
const bcrypt = require('bcryptjs');

let token;
let user;

beforeAll(async () => {
  const hash = await bcrypt.hash('Password123!', 10);
  user = createUser({
    email: 'export@example.com',
    password_hash: hash,
    name: 'Export User'
  });

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'export@example.com', password: 'Password123!' });
  
  token = res.body.accessToken;

  // Insert a mock activity
  const stmt = db.prepare(`
    INSERT INTO activities (user_id, category, subcategory, quantity, unit, co2_kg, activity_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(user.id, 'transportation', 'car_petrol', 10, 'km', 1.92, '2024-01-01', 'Test "notes", yes');
});

afterAll(() => {
  db.prepare('DELETE FROM activities WHERE user_id = ?').run(user.id);
  db.prepare('DELETE FROM users WHERE id = ?').run(user.id);
});

describe('Export CSV API', () => {
  it('should export CSV correctly', async () => {
    const res = await request(app)
      .get('/api/export/csv')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.headers['content-disposition']).toContain('attachment; filename="carbonsense_activities.csv"');
    expect(res.text).toContain('"Category","Subcategory","Quantity","Unit","CO2_kg","Date","Notes","Logged_At"');
    expect(res.text).toContain('"transportation","car_petrol","10","km","1.92","2024-01-01","Test ""notes"", yes"');
  });

  it('should return 401 if unauthorized', async () => {
    const res = await request(app).get('/api/export/csv');
    expect(res.status).toBe(401);
  });
});
