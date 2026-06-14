export const APP_CONSTANTS = {
  // Configs
  PORT_DEFAULT: 5000,
  
  // Redis & BullMQ Queue
  BULLMQ: {
    QUEUE_NAME: 'document-processing',
    JOB_CLEAN: 'clean-job',
    REMOVE_ON_COMPLETE_MAX: 100,
    REMOVE_ON_FAIL_MAX: 1000,
  },

  // JWT & Cookie
  JWT: {
    DEFAULT_SECRET: 'secret_key_12345',
    EXPIRES_IN: '7d',
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 ngày
  },

  // Pinecone
  PINECONE: {
    DEFAULT_INDEX: 'clean-text-index',
  },

  // HTML Cleaner
  HTML_CLEANER: {
    SAFE_STYLE_PROPS: new Set(['color', 'font-weight', 'font-style', 'text-decoration']),
  },

  // Response Messages
  MESSAGES: {
    AUTH: {
      MISSING_INFO: 'Vui lòng nhập đầy đủ thông tin.',
      EMAIL_USERNAME_EXISTS: 'Email hoặc Username đã tồn tại.',
      EMAIL_NOT_FOUND: 'Email không tồn tại.',
      PASSWORD_INCORRECT: 'Mật khẩu không chính xác.',
      REGISTER_SUCCESS: 'Đăng ký thành công.',
      LOGIN_SUCCESS: 'Đăng nhập thành công.',
      LOGOUT_SUCCESS: 'Đăng xuất thành công.',
      USER_NOT_FOUND: 'Không tìm thấy người dùng.',
      TOKEN_MISSING: 'Không tìm thấy Token xác thực',
      TOKEN_INVALID: 'Token không hợp lệ hoặc đã hết hạn'
    },
    CHAT: {
      MISSING_QUESTION: 'Vui lòng cung cấp câu hỏi.',
      AI_NOT_CONFIGURED: 'Dịch vụ AI hiện chưa được kích hoạt. Vui lòng liên hệ Admin cấu hình PINECONE_API_KEY và một AI Key (OPENAI_API_KEY hoặc GEMINI_API_KEY).',
      NO_CONTEXT_FOUND: 'Không tìm thấy tài liệu phù hợp trong cơ sở dữ liệu của bạn để làm ngữ cảnh trả lời câu hỏi này. Bạn hãy upload và dọn dẹp văn bản trước nhé!',
      RAG_ERROR: 'Lỗi hệ thống khi phân tích tài liệu.',
    },
    JOBS: {
      MISSING_HTML: 'Vui lòng cung cấp nội dung HTML',
      ENQUEUE_SUCCESS: 'Đã thêm tài liệu vào hàng đợi xử lý ngầm.',
      SERVER_ERROR: 'Lỗi máy chủ khi lập lịch xử lý.',
      NOT_FOUND: 'Không tìm thấy ID yêu cầu xử lý.',
      FAILED: 'Xử lý thất bại.',
      SSE_ERROR: 'Lỗi đường truyền dữ liệu thời gian thực.'
    },
    FEEDBACK: {
      MISSING_MESSAGE: 'Nội dung góp ý không được để trống.',
      SUCCESS: 'Gửi góp ý thành công!',
      ERROR: 'Có lỗi xảy ra khi gửi báo lỗi.'
    },
    HISTORY: {
      SAVE_ERROR: 'Lỗi server khi lưu lịch sử',
      LOAD_ERROR: 'Lỗi server khi tải lịch sử',
      DELETE_SUCCESS: 'Đã xóa lịch sử',
      DELETE_ERROR: 'Lỗi server khi xóa lịch sử'
    },
    RATE_LIMIT: {
      API: 'Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
      HEAVY: 'Bạn đang thao tác quá nhanh. Vui lòng thử lại sau 1 phút.'
    },
    SERVER: {
      INTERNAL_ERROR: 'Lỗi server nội bộ',
      DEFAULT_ERROR: 'Lỗi server. Vui lòng thử lại.'
    }
  }
};


