const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  async registerUser(email, username, password) {
    // Validate
    if (!email || !username || !password) {
      throw Object.assign(new Error('Vui lòng nhập đầy đủ thông tin.'), { status: 400 });
    }

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw Object.assign(new Error('Email hoặc Username đã tồn tại.'), { status: 400 });
    }

    // Create user
    const user = new User({ email, username, password });
    await user.save();

    return user;
  }

  async loginUser(email, password) {
    // Validate
    if (!email || !password) {
      throw Object.assign(new Error('Vui lòng nhập email và mật khẩu.'), { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw Object.assign(new Error('Email không tồn tại.'), { status: 400 });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw Object.assign(new Error('Mật khẩu không chính xác.'), { status: 400 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'secret_key_12345',
      { expiresIn: '7d' }
    );

    return { user, token };
  }
}

module.exports = new AuthService();
