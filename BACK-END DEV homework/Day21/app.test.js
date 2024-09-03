const request = require('supertest');
const app = require('./app')

describe('การทดสอบ API', () => {
  it('ควรส่งข้อความ Hello World เมื่อเรียก GET /', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World!');
  });

  it('ควรลงทะเบียนผู้ใช้ใหม่ได้เมื่อเรียก POST /api/auth/signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'testpassword', role: 'user' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('ควรเข้าสู่ระบบสำเร็จเมื่อเรียก POST /api/auth/signin', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ username: 'admin', password: 'admin' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('ควรส่งเนื้อหาสาธารณะเมื่อเรียก GET /api/test/all', async () => {
    const res = await request(app).get('/api/test/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Public content');
  });

  it('ควรส่งเนื้อหาสำหรับผู้ใช้เมื่อเรียก GET /api/test/user พร้อม token ที่ถูกต้อง', async () => {
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

  it('ควรส่งเนื้อหาสำหรับผู้ใช้เมื่อเรียก GET /api/test/user พร้อม token ที่ถูกต้อง', async () => {
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
  

  it('ควรไม่สามารถเข้าถึงเนื้อหาแอดมินเมื่อเรียก GET /api/test/admin โดยมี role เป็นผู้ใช้', async () => {
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
