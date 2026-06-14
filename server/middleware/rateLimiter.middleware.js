import { rateLimit } from 'express-rate-limit';
import RedisStoreModule from 'rate-limit-redis';
const RedisStore = RedisStoreModule.default || RedisStoreModule;
import redisClient from '../config/redis.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES } = APP_CONSTANTS;

// Limiter chung cho các API thông thường
const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 phút
  limit: 500, // Giới hạn 500 requests mỗi IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: MESSAGES.RATE_LIMIT.API,
  },
});

// Limiter nghiêm ngặt cho các tác vụ nặng (Auth, Document Processing, AI)
const heavyLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 1 phút
  limit: 100, // Giới hạn 100 requests mỗi phút
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: MESSAGES.RATE_LIMIT.HEAVY,
  },
});

export { apiLimiter, heavyLimiter };
