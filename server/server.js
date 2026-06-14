import 'dotenv/config.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Khởi chạy worker xử lý ngầm BullMQ
import './workers/documentWorker.js';

const app = express();
app.set('trust proxy', 1);

import { APP_CONSTANTS } from './common/constants/app.constant.js';
const PORT = process.env.PORT || APP_CONSTANTS.PORT_DEFAULT;
import { apiLimiter } from './middleware/rateLimiter.middleware.js';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Prometheus Metrics Configuration
import promClient from 'prom-client';
promClient.collectDefaultMetrics({ register: promClient.register });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    const route = req.route ? req.route.path : req.path;
    httpRequestDurationMicroseconds
      .labels(req.method, route || req.path, res.statusCode)
      .observe(durationInSeconds);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Apply global rate limiter
app.use('/api', apiLimiter);

// Root Router - Cấu trúc thư mục mới
import apiRouter from './routes/root.router.js';
app.use('/api', apiRouter);

// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/clean-text';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Đã kết nối với MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });
