// import request from 'supertest';
// import { app } from '../app';
// import { sequelize } from '../models';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('auth-test');

// describe('Auth API', () => {
//   beforeAll(async () => {
//     await sequelize.sync({ force: true });
//   });

//   afterAll(async () => {
//     await sequelize.close();
//   });

//   it('should register a new user and send OTP via email', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//         deliveryMethod: 'email',
//       });
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.email).toBe('test@example.com');
//     expect(response.body.message).toBe('OTP sent');
//   });

//   it('should register a new user and send OTP via phone', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')
//       .send({
//         email: 'test2@example.com',
//         password: 'password123',
//         phone: '+2341234567890',
//         deliveryMethod: 'phone',
//       });
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.message).toBe('OTP sent');
//   });

//   it('should verify OTP and return token', async () => {
//     await request(app)
//       .post('/api/auth/register')
//       .send({
//         email: 'test@example.com',
//         password: 'password123',
//         deliveryMethod: 'email',
//       });
//     // Mock OTP (retrieve from email/SMS in practice)
//     const response = await request(app)
//       .post('/api/auth/verify-otp')
//       .send({
//         email: 'test@example.com',
//         otp: '123456',
//       });
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('token');
//     expect(response.body.message).toBe('Account verified');
//   });

//   it('should fail login if not verified', async () => {
//     await request(app)
//       .post('/api/auth/register')
//       .send({
//         email: 'unverified@example.com',
//         password: 'password123',
//         deliveryMethod: 'email',
//       });
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'unverified@example.com',
//         password: 'password123',
//       });
//     expect(response.status).toBe(403);
//     expect(response.body).toEqual({
//       error: 'Account not verified. Please verify your OTP.',
//       details: [],
//     });
//   });
// });