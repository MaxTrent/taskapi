// import request from 'supertest';
// import jwt from 'jsonwebtoken';
// import { config } from '../config';
// import { Task } from 'models/task';
// import { app } from 'app';

// describe('Task API', () => {
//   let token: string;

//   beforeAll(async () => {
//     token = jwt.sign({ id: 1, email: 'test@example.com' }, config.JWT_SECRET, {
//       expiresIn: '1h',
//     });
//     await Task.sequelize?.sync({ force: true });
//   });

//   it('should create a task with valid input', async () => {
//     const response = await request(app)
//       .post('/api/tasks')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         title: 'Test Task',
//         description: 'A test task',
//         status: 'pending',
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.title).toBe('Test Task');
//     expect(response.body.status).toBe('pending');
//   });

//   it('should return 400 for invalid task input', async () => {
//     const response = await request(app)
//       .post('/api/tasks')
//       .set('Authorization', `Bearer ${token}`)
//       .send({
//         description: 'No title',
//         status: 'pending',
//       });

//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({
//       error: 'Validation failed',
//       details: expect.arrayContaining(['title: Title is required']),
//     });
//   });

//   it('should return 200 for status endpoint', async () => {
//     const response = await request(app).get('/status');

//     expect(response.status).toBe(200);
//     expect(response.body).toMatchObject({
//       success: true,
//       message: 'OK',
//       IP: expect.any(String),
//       URL: '/status',
//       timestamp: expect.any(String),
//     });
//   });
// });