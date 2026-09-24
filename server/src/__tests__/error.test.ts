import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Error Handling Middleware', () => {
  it('should return 404 for unknown endpoints with proper format', async () => {
    const response = await request(app).get('/api/v1/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: 'Endpoint GET /api/v1/non-existent-route not found.',
      error: { code: 'NOT_FOUND' }
    });
  });
});
