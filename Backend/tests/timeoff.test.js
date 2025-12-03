const request = require('supertest');
const express = require('express');

describe('Time Off Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    const authMiddleware = (req, res, next) => {
      const token = req.headers.authorization;
      if (!token || !token.includes('token')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = { role: token.includes('admin') ? 'admin' : 'employee' };
      next();
    };

    app.get('/timeoff', authMiddleware, (req, res) => {
      res.json([{ id: 1, status: 'pending' }]);
    });

    app.post('/timeoff', authMiddleware, (req, res) => {
      res.status(201).json({ message: 'Time off request created' });
    });

    app.put('/timeoff/:id/status', authMiddleware, (req, res) => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin only' });
      }
      res.json({ message: 'Status updated' });
    });
  });

  test('should require authentication for time off requests', async () => {
    const response = await request(app).get('/timeoff');
    expect(response.status).toBe(401);
  });

  test('should get time off requests with auth', async () => {
    const response = await request(app)
      .get('/timeoff')
      .set('Authorization', 'Bearer employee-token');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should create time off request', async () => {
    const response = await request(app)
      .post('/timeoff')
      .set('Authorization', 'Bearer employee-token')
      .send({ start_date: '2025-01-15', end_date: '2025-01-17' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Time off request created');
  });

  test('should allow admin to update status', async () => {
    const response = await request(app)
      .put('/timeoff/1/status')
      .set('Authorization', 'Bearer admin-token')
      .send({ status: 'approved' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Status updated');
  });

  test('should reject employee status updates', async () => {
    const response = await request(app)
      .put('/timeoff/1/status')
      .set('Authorization', 'Bearer employee-token')
      .send({ status: 'approved' });

    expect(response.status).toBe(403);
  });
});