class RateLimiter {
    /**
   * Configure the ratelimiter package.
   * @constructor
   * @param {Object} [options] - Options for the ratelimiter.
   * @param {number} [options.time=60] - The time window for the ratelimit in seconds. Default is 60 seconds (1 minute).
   * @param {number} [options.maxRequests=100] - The maximum number of requests allowed per time window. Default is 100.
   */
    constructor({ time = 60, maxRequests = 100 } = {}) {
      this.limits = new Map();
      this.time = time * 1000;
      this.maxRequests = maxRequests;
      this.ipLimits = new Map();
    }

    /**
   * Add rate limit for a specific path.
   * @param {string} path - The route that the ratelimiter will apply to. Example: www.example.com/api/examplePath.
   * @param {Object} [options] - The options for rate limiting for this specific path. Default is the general config.
   * @param {number} [options.time] - The time window for the ratelimit in seconds. Default is the general config.
   * @param {number} [options.maxRequests] - The maximum number of requests allowed per time window for this path. Default is general config.
   */
  
    addRateLimit(path, options = {}) {
      const rateLimit = {
        time: options.time * 1000 || this.time,
        maxRequests: options.maxRequests || this.maxRequests,
        timestamps: new Map()
      };
      this.limits.set(path, rateLimit);
    }

     /**
   * Middleware function to enforce rate limiting.
   * @returns {Function} Express middleware function.
   */
  
     middleware() {
        return (req, res, next) => {
          const path = req.path;
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get the client's IP address
          
          const rateLimit = this.limits.get(path);
      
          if (!rateLimit) {
            return next();
          }
      
          const currentTime = Date.now();
          const windowStart = currentTime - rateLimit.time;
          const ipTimestamps = rateLimit.timestamps.get(ip) || [];
      
          const filteredTimestamps = ipTimestamps.filter(timestamp => timestamp > windowStart);
      
          if (filteredTimestamps.length >= rateLimit.maxRequests) {
            return res.status(429).json({ error: 'Too many requests, please try again later.' });
          }
      
          rateLimit.timestamps.set(ip, [...filteredTimestamps, currentTime]);
          next();
        };
      }
  }
  
  module.exports = RateLimiter;