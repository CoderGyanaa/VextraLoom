import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { User } from '../models/User';
import { PasswordResetToken } from '../models/PasswordResetToken';
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
  await PasswordResetToken.deleteMany({});
  await RefreshToken.deleteMany({});
});

describe('Authentication Extensions API', () => {
  const registerUser = async () => {
    return request(app).post('/api/v1/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!'
    });
  };

  describe('Forgot Password Flow', () => {
    it('1. Existing email returns generic response', async () => {
      await registerUser();
      const res = await request(app).post('/api/v1/auth/forgot-password').send({ email: 'test@example.com' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('If an account exists');
      
      const tokens = await PasswordResetToken.find();
      expect(tokens.length).toBe(1);
    });

    it('2. Nonexistent email returns generic response', async () => {
      const res = await request(app).post('/api/v1/auth/forgot-password').send({ email: 'nobody@example.com' });
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('If an account exists');
      
      const tokens = await PasswordResetToken.find();
      expect(tokens.length).toBe(0);
    });

    it('8/9/10. Successful password reset', async () => {
      await registerUser();
      await request(app).post('/api/v1/auth/forgot-password').send({ email: 'test@example.com' });
      
      // We have to extract the token directly from DB because email is mocked
      // But wait! The DB stores the HASH, not the raw token.
      // So testing the full flow via DB is tricky since the raw token is securely emailed.
      // We will manually generate a token and hash it, inject to DB, and test reset.
      
      const user = await User.findOne({ email: 'test@example.com' });
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      
      await PasswordResetToken.create({
        user: user?._id,
        tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      });
      
      const res = await request(app).post('/api/v1/auth/reset-password').send({
        token: rawToken,
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!'
      });
      
      expect(res.status).toBe(200);
      
      // Attempt login with new password
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'NewPassword123!'
      });
      expect(loginRes.status).toBe(200);
    });
  });

  describe('Google Sign-In Flow', () => {
    const generateMockCredential = (payload: any) => {
      return Buffer.from(JSON.stringify(payload)).toString('base64');
    };

    it('6. New Google user creates account', async () => {
      const payload = { sub: '123456789', email: 'google@example.com', name: 'Google User', picture: 'http://pic.com/a.jpg' };
      const credential = generateMockCredential(payload);

      const res = await request(app).post('/api/v1/auth/google').send({ credential });
      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe('google@example.com');
      
      const dbUser = await User.findOne({ email: 'google@example.com' });
      expect(dbUser?.authProvider).toBe('google');
      expect(dbUser?.googleId).toBe('123456789');
    });

    it('7. Existing Google user logs in', async () => {
      const payload = { sub: '123456789', email: 'google@example.com', name: 'Google User' };
      const credential = generateMockCredential(payload);

      await request(app).post('/api/v1/auth/google').send({ credential });
      
      const res2 = await request(app).post('/api/v1/auth/google').send({ credential });
      expect(res2.status).toBe(200);
      expect(res2.body.data.accessToken).toBeDefined();
    });

    it('8. Existing local account with same email throws conflict', async () => {
      await registerUser(); // test@example.com
      
      const payload = { sub: '9999', email: 'test@example.com', name: 'Conflict User' };
      const credential = generateMockCredential(payload);

      const res = await request(app).post('/api/v1/auth/google').send({ credential });
      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('ACCOUNT_CONFLICT');
    });
  });
});
