import { Pinecone } from '@pinecone-database/pinecone';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { PINECONE } = APP_CONSTANTS;

const PINECONE_API_KEY = process.env.PINECONE_API_KEY || '';
const PINECONE_INDEX = process.env.PINECONE_INDEX || PINECONE.DEFAULT_INDEX;

let pc = null;
if (PINECONE_API_KEY) {
  try {
    pc = new Pinecone({ apiKey: PINECONE_API_KEY });
    console.log('🌲 Đã khởi tạo Pinecone Client');
  } catch (error) {
    console.error('❌ Lỗi khởi tạo Pinecone:', error.message);
  }
}

/**
 * Đẩy các đoạn vectors lên Pinecone Index
 */
const upsertDocumentVectors = async (documentId, userId, chunks, embeddings) => {
  if (!pc) {
    console.warn('⚠️ Bỏ qua upsert vector vì chưa cấu hình Pinecone.');
    return;
  }

  const index = pc.index(PINECONE_INDEX);
  const records = chunks.map((chunk, indexVal) => ({
    id: `${documentId}_chunk_${indexVal}`,
    values: embeddings[indexVal],
    metadata: {
      documentId: documentId.toString(),
      userId: userId ? userId.toString() : 'anonymous',
      text: chunk
    }
  }));

  // Upsert lên Pinecone (batch tối đa 100 records mỗi đợt)
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await index.upsert(batch);
  }
  console.log(`🌲 Đã index ${records.length} chunks lên Pinecone cho document ${documentId}`);
};

/**
 * Truy vấn các chunk văn bản tương đồng nhất dựa trên Vector Embedding
 */
const querySimilarContext = async (userId, queryEmbedding, topK = 4) => {
  if (!pc) {
    throw new Error('Chưa cấu hình PINECONE_API_KEY trong .env');
  }

  const index = pc.index(PINECONE_INDEX);
  const queryResponse = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    filter: {
      userId: { $eq: userId ? userId.toString() : 'anonymous' }
    }
  });

  // Gộp các đoạn văn bản liên quan tìm thấy
  const contexts = queryResponse.matches
    .filter(match => match.score > 0.3) // Chỉ lấy kết quả có độ tương đồng tương đối trở lên
    .map(match => match.metadata.text);

  return contexts.join('\n\n---\n\n');
};

export {
  upsertDocumentVectors,
  querySimilarContext
};
