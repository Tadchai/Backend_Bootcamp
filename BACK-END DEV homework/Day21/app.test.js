const request = require('supertest');
const app = require('./app')

describe('การทดสอบ API', () => {
  it('ส่งข้อความ Hello World เมื่อเรียก GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World!');
  });

  it('ลงทะเบียนผู้ใช้ใหม่ได้ POST /api/auth/signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'testpassword', role: 'user' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('เข้าสู่ระบบสำเร็จ POST /api/auth/signin', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'admin', password: 'admin' });
    // ทดสอบว่า res.body มี property ชื่อว่า 'token'
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');// เช็คว่ามี token
  });

  it('ส่ง message: "Public content" เมื่อเรียก GET /api/test/all', async () => {
    const res = await request(app).get('/api/test/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Public content');
  });

  it('ส่ง message: "User content" เมื่อเรียก GET /api/test/user พร้อม token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'admin', password: 'admin' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/test/user')
      .set('Authorization', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User content');
  });

  it('ส่ง message: "Require admin role" เมื่อเรียก GET /api/test/admin โดย role เป็น user', async () => {
    const loginRes = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'user', password: 'user' });
    const token = loginRes.body.token;

    const res = await request(app)
      .get('/api/test/admin')
      .set('Authorization', token);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe('Require admin role');
  });
});
