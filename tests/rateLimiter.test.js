const RateLimiter = require('../lib/rateLimiter');
const express = require('express');
const request = require('supertest');

describe('RateLimiter', () => {
  let app;
  let rateLimiter;

  beforeEach(() => {
    app = express();
    rateLimiter = new RateLimiter();
  });

  test('should allow requests under the limit', async () => {
    rateLimiter.addRateLimit('/test', { windowMs: 1000, maxRequests: 5 });
    app.use(rateLimiter.middleware());
    app.get('/test', (req, res) => res.send('ok'));

    const responses = await Promise.all([
      request(app).get('/test'),
      request(app).get('/test'),
      request(app).get('/test')
    ]);

    responses.forEach(response => {
      expect(response.status).toBe(200);
    });
  });

  test('should block requests over the limit', async () => {
    rateLimiter.addRateLimit('/test', { windowMs: 1000, maxRequests: 2 });
    app.use(rateLimiter.middleware());
    app.get('/test', (req, res) => res.send('ok'));

    await request(app).get('/test');
    await request(app).get('/test');
    const response = await request(app).get('/test');

    expect(response.status).toBe(429);
  });
});