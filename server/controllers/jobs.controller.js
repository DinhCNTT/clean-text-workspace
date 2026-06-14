import { addDocumentJob, documentQueue } from '../services/documentQueue.service.js';
import { QueueEvents } from 'bullmq';
import redisConnection from '../config/redis.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { BULLMQ, MESSAGES } = APP_CONSTANTS;

const queueEvents = new QueueEvents(BULLMQ.QUEUE_NAME, { connection: redisConnection });

class JobsController {
  async processJob(req, res) {
    try {
      const { rawHtml, options } = req.body;
      const userId = req.user ? req.user.userId : null;

      if (!rawHtml) {
        return res.status(400).json({ message: MESSAGES.JOBS.MISSING_HTML });
      }

      const job = await addDocumentJob(rawHtml, options, userId);
      
      res.status(202).json({
        jobId: job.id,
        message: MESSAGES.JOBS.ENQUEUE_SUCCESS
      });
    } catch (error) {
      console.error('Lỗi khi thêm job xử lý tài liệu:', error);
      res.status(500).json({ message: MESSAGES.JOBS.SERVER_ERROR });
    }
  }

  async streamProgress(req, res) {
    const { jobId } = req.params;

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
    });

    const sendEvent = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      const job = await documentQueue.getJob(jobId);
      if (!job) {
        sendEvent('error', { message: MESSAGES.JOBS.NOT_FOUND });
        return res.end();
      }

      const state = await job.getState();
      if (state === 'completed') {
        sendEvent('completed', job.returnvalue);
        return res.end();
      }
      if (state === 'failed') {
        sendEvent('failed', { error: job.failedReason || MESSAGES.JOBS.FAILED });
        return res.end();
      }

      sendEvent('progress', { progress: job.progress || 0 });

      const onProgress = ({ jobId: id, data }) => {
        if (id === jobId) {
          sendEvent('progress', { progress: data });
        }
      };

      const onCompleted = ({ jobId: id, returnvalue }) => {
        if (id === jobId) {
          sendEvent('completed', returnvalue);
          cleanup();
        }
      };

      const onFailed = ({ jobId: id, failedReason }) => {
        if (id === jobId) {
          sendEvent('failed', { error: failedReason || MESSAGES.JOBS.FAILED });
          cleanup();
        }
      };

      queueEvents.on('progress', onProgress);
      queueEvents.on('completed', onCompleted);
      queueEvents.on('failed', onFailed);

      const cleanup = () => {
        queueEvents.off('progress', onProgress);
        queueEvents.off('completed', onCompleted);
        queueEvents.off('failed', onFailed);
        res.end();
      };

      req.on('close', () => {
        cleanup();
      });

    } catch (error) {
      console.error(`Lỗi kết nối SSE cho Job ${jobId}:`, error);
      sendEvent('error', { message: MESSAGES.JOBS.SSE_ERROR });
      res.end();
    }
  }
}

export default new JobsController();
