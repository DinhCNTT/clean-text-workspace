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
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/60 pt-16 pb-8 relative overflow-hidden bg-white/40 dark:bg-slate-900/20 backdrop-blur-md">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent dark:via-indigo-500/50" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-16">
            
            <div className="md:col-span-4 flex flex-col gap-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-indigo-400 dark:to-pink-400 flex items-center gap-2 group cursor-default">
                <Sparkles size={20} className="text-indigo-500 group-hover:rotate-180 transition-transform duration-500" />
                Clean Text
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                Công cụ tối ưu hóa văn bản mạnh mẽ. Xóa bỏ định dạng rác từ AI Chatbot, giữ nguyên tính nguyên bản của văn bản khi dán vào Microsoft Word.
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="group relative overflow-hidden text-[11px] font-bold px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#61DAFB] hover:text-[#61DAFB] dark:hover:text-[#61DAFB] transition-all duration-300 shadow-sm hover:shadow-[#61DAFB]/20 hover:-translate-y-0.5 cursor-default">
                  <div className="absolute inset-0 bg-[#61DAFB]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">React 18</span>
                </span>
                <span className="group relative overflow-hidden text-[11px] font-bold px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#38B2AC] hover:text-[#38B2AC] dark:hover:text-[#38B2AC] transition-all duration-300 shadow-sm hover:shadow-[#38B2AC]/20 hover:-translate-y-0.5 cursor-default">
                  <div className="absolute inset-0 bg-[#38B2AC]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">Tailwind v4</span>
                </span>
                <span className="group relative overflow-hidden text-[11px] font-bold px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#646CFF] hover:text-[#646CFF] dark:hover:text-[#646CFF] transition-all duration-300 shadow-sm hover:shadow-[#646CFF]/20 hover:-translate-y-0.5 cursor-default">
                  <div className="absolute inset-0 bg-[#646CFF]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">Vite</span>
                </span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Code2 size={16} className="text-indigo-500" />
                Tác Giả
              </h3>
              <div className="mt-1">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-default">Đoàn Tuệ Định</h4>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Fresher .NET Developer</p>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Đam mê xây dựng kiến trúc hệ thống backend và thiết kế UI/UX hiện đại. Luôn hướng tới trải nghiệm người dùng hoàn hảo và code sạch.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" />
                Liên Hệ
              </h3>
              <ul className="flex flex-col gap-3.5 text-sm text-slate-600 dark:text-slate-400 mt-1">
                <li className="flex items-start gap-3 group cursor-default">
                  <MapPin size={16} className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0 group-hover:text-indigo-500 transition-colors" />
                  <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">Ho Chi Minh City, Vietnam</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <Phone size={16} className="text-slate-400 dark:text-slate-500 shrink-0 group-hover:text-indigo-500 group-hover:-rotate-12 transition-all duration-300" />
                  <a href="tel:+84842070552" className="font-medium relative inline-block text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    (+84) 842 070 552
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
                <li className="flex items-center gap-3 group">
                  <Mail size={16} className="text-slate-400 dark:text-slate-500 shrink-0 group-hover:text-pink-500 group-hover:rotate-12 transition-all duration-300" />
                  <a href="mailto:dinhcm123321@gmail.com" className="font-medium relative inline-block text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                    dinhcm123321@gmail.com
                    <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
              
              <div className="flex gap-3 mt-3">
                <a href="https://github.com/DinhCNTT" target="_blank" rel="noreferrer" 
                   className="p-2.5 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-lg backdrop-blur-md">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                     <path d="M9 18c-4.51 2-5-2-7-2"/>
                   </svg>
                </a>
                <a href="https://linkedin.com/in/doantuedinh" target="_blank" rel="noreferrer" 
                   className="p-2.5 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 hover:border-[#0A66C2] hover:bg-[#0A66C2] dark:hover:bg-[#0A66C2]/20 hover:shadow-lg backdrop-blur-md">
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                     <rect width="4" height="12" x="2" y="9"/>
                     <circle cx="4" cy="4" r="2"/>
                   </svg>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
              Phát triển với <Heart size={14} className="text-pink-500 fill-pink-500 animate-pulse drop-shadow-md mx-0.5" /> bởi Đoàn Tuệ Định © {new Date().getFullYear()}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 text-xs font-semibold">
              <Link to="/terms" target="_blank" className="px-3 py-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">Điều Khoản</Link>
              <Link to="/privacy" target="_blank" className="px-3 py-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">Bảo Mật</Link>
              <button onClick={() => setActiveModal('bug')} className="px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/30 hover:scale-105 transition-all duration-200 flex items-center gap-1.5 group shadow-sm">
                <Bug size={14} className="group-hover:animate-bounce" /> Góp Ý & Báo Lỗi
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}

      <Modal isOpen={activeModal === 'bug'} onClose={() => { setActiveModal(null); setTimeout(() => setBugReportStatus('idle'), 300); }} title="Góp Ý & Báo Lỗi" icon={<Bug size={24} className="text-orange-500" />}>
        {bugReportStatus === 'sent' ? (
          <div className="text-center py-10 px-4 animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30 scale-in-center">
              <CheckCheck size={40} className="text-white" />
            </div>
            <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Cảm ơn bạn rất nhiều!</h4>
            <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed max-w-[280px]">
              Góp ý của bạn đã được chuyển thẳng tới hệ thống của mình. Mình sẽ kiểm tra và nâng cấp sớm nhất.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="text-[13px] text-slate-600 dark:text-slate-400 bg-orange-50 dark:bg-orange-500/10 p-4 rounded-xl border border-orange-100 dark:border-orange-500/20 leading-relaxed">
              Dự án liên tục được tối ưu. Tuy nhiên, nếu bạn thấy văn bản làm sạch ra bị mất chữ, hoặc tính năng nào đó bị lỗi giật lag, đừng ngần ngại cho mình biết nhé!
            </div>
            
            <div className="relative group">
              <textarea 
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSendFeedback();
                  }
                }}
                className="w-full min-h-[140px] p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 resize-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 shadow-inner"
                placeholder="Vd: Mình dán văn bản từ file PDF bị dính dòng, màn hình điện thoại bị tràn chữ..."
              />
              <div className="absolute bottom-3 right-3 text-xs font-semibold text-slate-400">Ctrl + Enter để gửi</div>
            </div>

            <button 
              onClick={handleSendFeedback}
              disabled={!feedbackText.trim() || bugReportStatus === 'sending'}
              className="group relative w-full overflow-hidden rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold py-3.5 transition-all hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="relative flex items-center justify-center gap-2">
                {bugReportStatus === 'sending' ? (
                  <>
                    <Server size={18} className="animate-pulse" /> Đang truyền dữ liệu...
                  </>
                ) : (
                  <>
                    <Send size={18} className="group-hover:rotate-12 transition-transform" /> Gửi Góp Ý
                  </>
                )}
              </div>
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Footer;
