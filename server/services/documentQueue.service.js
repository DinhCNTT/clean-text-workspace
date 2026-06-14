import { Queue } from 'bullmq';
import redisConnection from '../config/redis.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { BULLMQ } = APP_CONSTANTS;

// Khởi tạo queue xử lý văn bản
const documentQueue = new Queue(BULLMQ.QUEUE_NAME, {
  connection: redisConnection
});

/**
 * Thêm job mới vào hàng đợi xử lý ngầm
 * @param {string} rawHtml - HTML thô cần xử lý
 * @param {object} options - Tùy chọn dọn dẹp (removeLinks, plainTextOnly)
 * @param {string} userId - ID của user thực hiện (nếu đã đăng nhập)
 */
const addDocumentJob = async (rawHtml, options, userId = null) => {
  const job = await documentQueue.add(
    BULLMQ.JOB_CLEAN,
    { rawHtml, options, userId },
    {
      removeOnComplete: { maxCount: BULLMQ.REMOVE_ON_COMPLETE_MAX },
      removeOnFail: { maxCount: BULLMQ.REMOVE_ON_FAIL_MAX }
    }
  );
  return job;
};

export {
  documentQueue,
  addDocumentJob
};
