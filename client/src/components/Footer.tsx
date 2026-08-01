import React, { useState } from 'react';
import { 
  Heart, Sparkles, Code2, Mail, MapPin, Phone, 
  Bug, CheckCheck, Send, Server
} from 'lucide-react';
import Modal from './Modal';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'bug' | null>(null);
  const [bugReportStatus, setBugReportStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setBugReportStatus('sending');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedbackText })
      });

      if (res.ok) {
        setBugReportStatus('sent');
        setFeedbackText('');
      } else {
        setBugReportStatus('idle');
        alert('Có lỗi xảy ra, không thể gửi góp ý!');
      }
    } catch (error) {
      console.error(error);
      setBugReportStatus('idle');
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <>
      <footer className="mt-20 pt-16 pb-8 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 select-none">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Column 1: App Info */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 group">
                <Sparkles size={18} className="text-indigo-500 dark:text-indigo-400" />
                Clean Text
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed max-w-xs">
                Công cụ tối ưu hóa văn bản thô sao chép từ chatbot AI & PDF. Giúp xử lý và định dạng chuẩn hóa nhanh chóng để chèn vào Microsoft Word.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
                  React 19
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
                  Tailwind v4
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700">
                  Vite 6
                </span>
              </div>
            </div>

            {/* Column 2: Author */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Code2 size={14} className="text-indigo-500 dark:text-indigo-400" />
                Tác Giả
              </h3>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-base">Đoàn Tuệ Định</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Fresher .NET Developer</p>
              </div>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                Đam mê thiết kế UI/UX và xây dựng các hệ thống web chuyên nghiệp. Luôn cam kết nâng cao trải nghiệm người dùng.
              </p>
            </div>

            {/* Column 3: Contact */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} className="text-indigo-500 dark:text-indigo-400" />
                Liên Hệ
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-550 dark:text-slate-400">
                <li className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                  <span>Ho Chi Minh City, Vietnam</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                  <a href="tel:+84842070552" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                    (+84) 842 070 552
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
                  <a href="mailto:dinhcm123321@gmail.com" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                    dinhcm123321@gmail.com
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              Phát triển với <Heart size={10} className="text-pink-500 fill-pink-500" /> bởi Đoàn Tuệ Định © {new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <Link to="/terms" target="_blank" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors">Điều Khoản</Link>
              <Link to="/privacy" target="_blank" className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors">Bảo Mật</Link>
              <button 
                onClick={() => setActiveModal('bug')} 
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/35 transition-all text-[10px] cursor-pointer"
              >
                <Bug size={12} /> Báo Lỗi & Góp Ý
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal báo lỗi giữ nguyên logic */}
      <Modal 
        isOpen={activeModal === 'bug'} 
        onClose={() => { setActiveModal(null); setTimeout(() => setBugReportStatus('idle'), 300); }} 
        title="Góp Ý & Báo Lỗi" 
        icon={<Bug size={20} className="text-orange-500" />}
      >
        {bugReportStatus === 'sent' ? (
          <div className="text-center py-8 px-4 flex flex-col items-center select-none">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-900">
              <CheckCheck size={30} className="text-emerald-600 dark:text-emerald-450" />
            </div>
            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mb-2">Cảm ơn góp ý của bạn!</h4>
            <p className="text-slate-505 dark:text-slate-400 text-xs leading-relaxed max-w-[280px]">
              Góp ý đã được gửi trực tiếp tới telegram phát triển. Mình sẽ xem xét cải thiện sớm nhất.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-slate-600 dark:text-slate-400 bg-orange-50 dark:bg-orange-500/10 p-3 rounded-xl border border-orange-100 dark:border-orange-500/20 leading-relaxed">
              Bạn có thể góp ý trực tiếp tại đây hoặc thông qua biểu mẫu ở phần cuối trang chủ.
            </div>
            
            <div className="relative">
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSendFeedback();
                  }
                }}
                className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:border-indigo-500 transition-all text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                placeholder="Nội dung ý kiến hoặc lỗi bạn gặp phải..."
              />
            </div>

            <button 
              onClick={handleSendFeedback}
              disabled={!feedbackText.trim() || bugReportStatus === 'sending'}
              className="w-full rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold py-3 text-xs cursor-pointer transition-all hover:bg-slate-800 dark:hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bugReportStatus === 'sending' ? (
                <>
                  <Server size={14} className="animate-pulse" /> Đang gửi...
                </>
              ) : (
                <>
                  <Send size={14} /> Gửi góp ý (Ctrl + Enter)
                </>
              )}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Footer;
