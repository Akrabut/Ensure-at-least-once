const redis = require('redis');

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URI, { no_ready_check: true });
client.auth(process.env.REDIS_PASSWORD, err => {
  if(err) throw err;
});

client.on('connect', () => console.log('Redis connection sucessful'));

module.exports = client;