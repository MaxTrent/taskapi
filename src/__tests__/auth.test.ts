import request from 'supertest';
import { createLogger } from '../utils/logger';
import { sequelize } from '../models';
import { app } from 'app';

const logger = createLogger('authTest');

describe('Auth API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    logger.info('Database reset for tests');
  });

  afterAll(async () => {
    await sequelize.close();
    logger.info('Database connection closed');
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123', role: 'user' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
    logger.info('Register test passed');
  });

  it('should login an existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    logger.info('Login test passed');
  });
});