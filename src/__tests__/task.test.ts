import request from 'supertest';
import { app } from '../app';
import { createLogger } from '../utils/logger';
import { sequelize } from '../models';
import jwt from 'jsonwebtoken';

const logger = createLogger('taskTest');

describe('Task API', () => {
  let token: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    logger.info('Database reset for tests');
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'task@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'task@example.com', password: 'password123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
    logger.info('Database connection closed');
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', description: 'A test task' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Task');
    logger.info('Create task test passed');
  });
});