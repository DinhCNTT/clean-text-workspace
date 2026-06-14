import authService from '../services/auth.service.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES, JWT } = APP_CONSTANTS;

class AuthController {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const user = await authService.registerUser(email, username, password);
      
      res.status(201).json({ message: MESSAGES.AUTH.REGISTER_SUCCESS, userId: user._id });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({ message: MESSAGES.SERVER.DEFAULT_ERROR });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.loginUser(email, password);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: JWT.COOKIE_MAX_AGE
      });

      res.status(200).json({
        message: MESSAGES.AUTH.LOGIN_SUCCESS,
        token, 
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Lỗi đăng nhập:', error);
      res.status(500).json({ message: MESSAGES.SERVER.DEFAULT_ERROR });
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      res.status(200).json({ message: MESSAGES.AUTH.LOGOUT_SUCCESS });
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      res.status(500).json({ message: MESSAGES.SERVER.DEFAULT_ERROR });
    }
  }

  async getMe(req, res) {
    try {
      const user = await authService.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: MESSAGES.AUTH.USER_NOT_FOUND });
      }
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Lỗi lấy thông tin user:', error);
      res.status(500).json({ message: MESSAGES.SERVER.INTERNAL_ERROR });
    }
  }
}

export default new AuthController();
