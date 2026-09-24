import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { RefreshToken } from '../models/RefreshToken';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Profile.deleteMany({});
  await RefreshToken.deleteMany({});
});

describe('Authentication API', () => {
  const validRegisterData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!'
  };

  it('1. successful registration', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(validRegisterData);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(validRegisterData.email);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.accessToken).toBeDefined();
    
    // Cookie test
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('refreshToken');
    expect(cookies[0]).toContain('HttpOnly');
  });

  it('2. duplicate registration', async () => {
    await request(app).post('/api/v1/auth/register').send(validRegisterData);
    const res = await request(app).post('/api/v1/auth/register').send(validRegisterData);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('DUPLICATE_EMAIL');
  });

  it('3. invalid email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ ...validRegisterData, email: 'notanemail' });
    if (res.status === 500) console.log('500 ERROR BODY:', res.body);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('4. weak password', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ ...validRegisterData, password: 'weak' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('5. successful login', async () => {
    await request(app).post('/api/v1/auth/register').send(validRegisterData);
    const res = await request(app).post('/api/v1/auth/login').send({
      email: validRegisterData.email,
      password: validRegisterData.password
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('6. invalid password', async () => {
    await request(app).post('/api/v1/auth/register').send(validRegisterData);
    const res = await request(app).post('/api/v1/auth/login').send({
      email: validRegisterData.email,
      password: 'WrongPassword1!'
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('7. nonexistent account', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'nobody@example.com',
      password: 'Password123!'
    });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS'); // Generic message
  });

  it('8. protected route without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('9. protected route with valid token', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send(validRegisterData);
    const token = reg.body.data.accessToken;

    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer ' + token);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(validRegisterData.email);
  });

  it('13. logout', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send(validRegisterData);
    const cookie = reg.headers['set-cookie'];
    
    const res = await request(app).post('/api/v1/auth/logout').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toContain('refreshToken=;'); // Cleared
  });

});
