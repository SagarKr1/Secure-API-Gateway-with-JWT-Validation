const { createClient } = require('redis');
require('dotenv').config();


const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('connect', () => console.log('✅ Redis connected'));
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

redisClient.connect();

module.exports = redisClient;
