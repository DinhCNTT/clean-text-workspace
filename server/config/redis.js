import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';

const redisConfig = {
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
  maxRetriesPerRequest: null, // Yêu cầu bắt buộc đối với BullMQ
};

if (REDIS_PASSWORD) {
  redisConfig.password = REDIS_PASSWORD;
  // Upstash và các Redis Cloud provider đều yêu cầu TLS khi có password
  redisConfig.tls = {};
}

const redisConnection = new Redis(redisConfig);

redisConnection.on('connect', () => {
  console.log('✅ Đã kết nối với Redis');
});

redisConnection.on('error', (err) => {
  console.error('❌ Lỗi kết nối Redis:', err.message);
});

export default redisConnection;
