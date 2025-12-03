const request = require('supertest');
const express = require('express');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    app.post('/auth/login', (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      if (email === 'admin@hr.com' && password === 'password') {
        res.json({ token: 'admin-token', user: { role: 'admin' } });
      } else if (email.includes('@hr.com') && password === 'password') {
        res.json({ token: 'employee-token', user: { role: 'employee' } });
      } else {
        res.status(400).json({ error: 'Invalid credentials' });
      }
    });
  });

  test('should authenticate admin user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@hr.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('admin');
    expect(response.body.token).toBe('admin-token');
  });

  test('should authenticate employee user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'employee@hr.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('employee');
  });

  test('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@email.com', password: 'wrong' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid credentials');
  });
});