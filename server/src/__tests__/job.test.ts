import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { Job } from '../models/Job';

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

describe('Job API representative pattern', () => {
  it('should get empty jobs list', async () => {
    const response = await request(app).get('/api/v1/jobs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual([]);
  });

  it('should validate and fail job creation with invalid data', async () => {
    const response = await request(app)
      .post('/api/v1/jobs')
      .send({ title: 'A' }); // title too short, missing required fields

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('should create a valid job', async () => {
    const newJob = {
      title: 'Software Engineer',
      organization: 'Tech Corp',
      description: 'A very cool job with lots of description text here.',
      workMode: 'remote'
    };

    const response = await request(app)
      .post('/api/v1/jobs')
      .send(newJob);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(newJob.title);
    expect(response.body.data.organization).toBe(newJob.organization);
  });
});
