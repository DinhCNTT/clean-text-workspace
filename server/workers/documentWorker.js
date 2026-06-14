import { Worker } from 'bullmq';
import redisConnection from '../config/redis.js';
import { cleanHtmlUtils } from '../common/helpers/htmlCleaner.util.js';
import historyService from '../services/history.service.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { BULLMQ } = APP_CONSTANTS;
import { chunkText, generateEmbedding } from '../services/ai.service.js';
import { upsertDocumentVectors } from '../services/vectorDb.service.js';

// Khởi tạo Worker xử lý hàng đợi
const documentWorker = new Worker(
  BULLMQ.QUEUE_NAME,
  async (job) => {
    console.log(`👷 Worker bắt đầu xử lý job ${job.id}...`);
    
    const { rawHtml, options, userId } = job.data;
    
    // Bước 1: Bắt đầu xử lý dọn dẹp HTML
    await job.updateProgress(20);
    const cleanedHtml = cleanHtmlUtils(rawHtml, options);
    
    // Bước 2: Lưu vào lịch sử MongoDB nếu user đã đăng nhập
    await job.updateProgress(60);
    let historyRecord = null;
    if (userId) {
      historyRecord = await historyService.saveHistory(userId, cleanedHtml);
    }

    // Bước 3: Tách đoạn và Index lên Vector Database (Pinecone) phục vụ RAG
    if (process.env.PINECONE_API_KEY && (process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY)) {
      try {
        await job.updateProgress(80);
        // Loại bỏ thẻ HTML và khoảng trắng thừa để lấy văn bản thuần sạch
        const plainText = cleanedHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('👷 Worker plainText nhận được:', plainText);
        

        const chunks = chunkText(plainText);
        console.log('👷 Worker chunks chia ra:', chunks);
        if (chunks.length > 0) {
          const embeddings = [];
          for (const chunk of chunks) {
            const vector = await generateEmbedding(chunk);
            embeddings.push(vector);
          }
          const docId = historyRecord ? historyRecord._id : `anon_${job.id}`;
          await upsertDocumentVectors(docId, userId, chunks, embeddings);
        }
      } catch (err) {
        console.error('❌ Lỗi tạo Vector Index cho tài liệu:', err.message);
      }
    }
    
    // Hoàn thành
    await job.updateProgress(100);
    console.log(`✅ Worker hoàn thành job ${job.id}`);
    
    return {
      cleanedHtml,
      historyId: historyRecord ? historyRecord._id : null
    };
  },
  {
    connection: redisConnection,
    concurrency: 2 // Cho phép chạy song song tối đa 2 job trên mỗi worker thread
  }
);

documentWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} thất bại:`, err.message);
});

export default documentWorker;
