# expressRatelimiter
An express.js ratelimit package that allows you to easily add IP based ratelimits to your express API / Website.

## How to install
Run the following command on your terminal.
```bash
npm install expressratelimiter
```
Then Node Package Manager will install the package onto your project.

## How to use
Once that is done initialize the package by adding this into your code.
```js
const express = require('express');
const RateLimiter = require('expressratelimiter');

const app = express();
const rateLimiter = new RateLimiter({time: 10 , maxRequests: 2});

app.use(rateLimiter.middleware());
```
Replace `Time` and `maxRequests` with the ratelimit configuration you prefer. If you leave the options empty the defaults are 100 requests per minute.

To add your first ratelimit to your website / API add the following codeline to your file.
```js
rateLimiter.addRateLimit('/path', { time: 10, maxRequests: 2 });
```
You need to change `'/path'` to the path of the route you want to ratelimit. For example: `/path` will block `www.example.com/path`

Your server file should look something like this:
```js
const express = require('express');
const RateLimiter = require('expressratelimiter');

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
```

## Updates
This package will have updates every once in a while, check the releases page for all versions of the package.

Current version: `v1.0.0`

## Support
If you need support or have any suggestions you can send an email to `r.micheal.dev@gmail.com`.