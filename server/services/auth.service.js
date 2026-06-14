import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { APP_CONSTANTS } from '../common/constants/app.constant.js';
const { MESSAGES, JWT } = APP_CONSTANTS;

class AuthService {
  async registerUser(email, username, password) {
    // Validate
    if (!email || !username || !password) {
      throw Object.assign(new Error(MESSAGES.AUTH.MISSING_INFO), { status: 400 });
    }

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw Object.assign(new Error(MESSAGES.AUTH.EMAIL_USERNAME_EXISTS), { status: 400 });
    }

    // Create user
    const user = new User({ email, username, password });
    await user.save();

    return user;
  }

  async loginUser(email, password) {
    // Validate
    if (!email || !password) {
      throw Object.assign(new Error(MESSAGES.AUTH.MISSING_INFO), { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw Object.assign(new Error(MESSAGES.AUTH.EMAIL_NOT_FOUND), { status: 400 });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw Object.assign(new Error(MESSAGES.AUTH.PASSWORD_INCORRECT), { status: 400 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || JWT.DEFAULT_SECRET,
      { expiresIn: JWT.EXPIRES_IN }
    );

    return { user, token };
  }

  async getUserById(id) {
    return await User.findById(id);
  }
}

export default new AuthService();
