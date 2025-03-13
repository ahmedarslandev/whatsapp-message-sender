const redis = {
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  enableAutoPipelining: true,
};

module.exports = { redis };
