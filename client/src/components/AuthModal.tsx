import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin ? { email, password } : { email, username, password };

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đã có lỗi xảy ra');
      }

      if (isLogin) {
        onSuccess(data.user);
        onClose();
      } else {
        // Sau khi đăng ký thành công, tự động chuyển sang form đăng nhập
        setIsLogin(true);
        setError('Đăng ký thành công! Vui lòng đăng nhập.'); // Dùng error state tạm để hiện thông báo xanh (sẽ style lại sau)
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.header}>
          <h2>{isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}</h2>
          <p>{isLogin ? 'Đăng nhập để lưu trữ lịch sử của bạn' : 'Đăng ký để trải nghiệm đầy đủ tính năng'}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={`${styles.message} ${error.includes('thành công') ? styles.success : styles.error}`}>
              {error}
            </div>
          )}

          {!isLogin && (
            <div className={styles.inputGroup}>
              <User className={styles.inputIcon} size={18} />
              <input
                type="text"
                placeholder="Tên hiển thị"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={18} />
            <input
              type="email"
              placeholder="Địa chỉ Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={18} />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <Loader2 className={styles.spinner} size={20} />
            ) : (
              <>
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <span className={styles.switchBtn} onClick={toggleMode}>
              {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
