const authService = require('../services/auth.service');

class AuthController {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const user = await authService.registerUser(email, username, password);
      
      res.status(201).json({ message: 'Đăng ký thành công.', userId: user._id });
    } catch (error) {
      if (error.status === 400) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Lỗi đăng ký:', error);
      res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.loginUser(email, password);

      res.status(200).json({
        message: 'Đăng nhập thành công.',
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
      res.status(500).json({ message: 'Lỗi server. Vui lòng thử lại.' });
    }
  }
}

module.exports = new AuthController();
