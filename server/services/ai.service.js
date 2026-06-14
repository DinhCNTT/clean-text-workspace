import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

/**
 * Phân rã văn bản sạch thành các đoạn nhỏ (chunking) bằng cơ chế cửa sổ trượt (sliding window)
 * @param {string} text - Văn bản đã dọn dẹp (đã loại bỏ HTML tags để embedding chính xác)
 * @param {number} chunkSize - Kích thước tối đa mỗi chunk (ký tự)
 * @param {number} chunkOverlap - Kích thước chồng lấp giữa 2 chunk liên tiếp
 */
const chunkText = (text, chunkSize = 800, chunkOverlap = 150) => {
  if (!text || typeof text !== 'string') return [];
  
  const chunks = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;
    
    // Nếu phần còn lại nhỏ hơn hoặc bằng chunkSize, lấy toàn bộ rồi thoát
    if (endIndex >= text.length) {
      const chunk = text.substring(startIndex).trim();
      if (chunk) chunks.push(chunk);
      break;
    }
    
    // Tự động tìm vị trí cắt lý tưởng nhất (không cắt ngang từ/câu)
    let cutIndex = endIndex;
    
    // Thứ tự ưu tiên cắt: Cắt đoạn (đoạn văn) -> Cắt câu (dấu chấm) -> Cắt cụm -> Cắt từ (khoảng trắng)
    const delimiters = ['\n\n', '\n', '. ', '? ', '! ', '." ', '?" ', '!" ', '; ', ', ', ' '];
    
    for (const delimiter of delimiters) {
      const lastDelim = text.lastIndexOf(delimiter, endIndex);
      
      // Chỉ chấp nhận cắt nếu nó không làm chunk bị quá ngắn (lớn hơn 50% chunkSize)
      if (lastDelim > startIndex + (chunkSize / 2)) {
        cutIndex = lastDelim + delimiter.length;
        break; // Ngừng vòng lặp khi đã tìm được vị trí cắt tốt nhất
      }
    }
    
    const chunk = text.substring(startIndex, cutIndex).trim();
    if (chunk) chunks.push(chunk);
    
    // Bước tới chunk tiếp theo, nhưng lùi lại (overlap) để giữ ngữ cảnh liên kết
    // Sử dụng Math.max để đảm bảo luôn tịnh tiến về phía trước (chống vòng lặp vô hạn)
    startIndex = Math.max(startIndex + 1, cutIndex - chunkOverlap);
  }
  
  return chunks;
};

/**
 * Tạo Vector Embedding cho văn bản
 */
const generateEmbedding = async (text) => {
  // Ưu tiên sử dụng Gemini (hoàn toàn miễn phí)
  if (genAI) {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(text);
    return result.embedding.values; 
  }

  // Fallback sang OpenAI nếu có key
  if (!openai) {
    throw new Error('Chưa cấu hình OPENAI_API_KEY hoặc GEMINI_API_KEY trong file .env');
  }

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
    encoding_format: 'float'
  });

  return response.data[0].embedding; // Vector 1536 chiều
};

/**
 * Trả lời câu hỏi dựa trên ngữ cảnh được truyền vào (RAG Chat Completion)
 */
const askQuestionWithContext = async (context, question) => {
  const systemPrompt = `Bạn là trợ lý AI thông minh tích hợp trong ứng dụng Clean Text Workspace.
Nhiệm vụ của bạn là trả lời câu hỏi của người dùng dựa trên ngữ cảnh tài liệu được cung cấp dưới đây.
Nếu ngữ cảnh không chứa thông tin trả lời, hãy nói rõ là "Thông tin không có trong tài liệu của bạn" thay vì tự bịa ra câu trả lời.

--- Ngữ cảnh tài liệu bắt đầu ---
${context}
--- Ngữ cảnh tài liệu kết thúc ---`;

  // Ưu tiên sử dụng Gemini
  if (genAI) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `${systemPrompt}\n\nCâu hỏi: ${question}`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // Fallback sang OpenAI
  if (!openai) {
    throw new Error('Chưa cấu hình OPENAI_API_KEY hoặc GEMINI_API_KEY trong file .env');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ],
    temperature: 0.3
  });

  return response.choices[0].message.content;
};

export {
  chunkText,
  generateEmbedding,
  askQuestionWithContext
};
