const express = require('express');
const RateLimiter = require('./index');

const app = express();
const rateLimiter = new RateLimiter({time: 10, maxRequests: 2});

rateLimiter.addRateLimit('/api', { time: 10, maxRequests: 2 });

app.use(rateLimiter.middleware());

app.get('/api', (req, res) => {
  res.send('OK!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});