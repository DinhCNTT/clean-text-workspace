import jwt from 'jsonwebtoken';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { JWT, MESSAGES } = APP_CONSTANTS;

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: MESSAGES.AUTH.TOKEN_MISSING });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || JWT.DEFAULT_SECRET);
    req.user = decoded; // { userId: ... }
    next();
  } catch (error) {
    res.status(401).json({ message: MESSAGES.AUTH.TOKEN_INVALID });
  }
};

export default auth;
