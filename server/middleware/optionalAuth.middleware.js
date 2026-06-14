import jwt from 'jsonwebtoken';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { JWT } = APP_CONSTANTS;

const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT.DEFAULT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Bỏ qua lỗi xác thực nếu chỉ là guest
  }
  next();
};

export default optionalAuth;
