import React from 'react';
import { Zap, FileText, CheckCheck, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="pt-16 pb-8 px-6 text-center relative">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide shadow-sm">
        <div className="pulse-dot" />
        Hỗ trợ Rich Text — Giữ nguyên màu sắc, in đậm, in nghiêng
      </div>

      {/* Title */}
      <h1 className="gradient-title text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">
        Clean Text Workspace
      </h1>
      <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
        Dán từ Gemini, Word, PDF — làm sạch tức thì — dán lại vào Word hoàn hảo.<br />
        <span className="text-slate-500 dark:text-slate-500 text-sm">Không có bullet rác. Không bảng lỗi. Định dạng nguyên vẹn.</span>
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {[
          { icon: <Zap size={12} />, text: 'Lưu nháp tự động' },
          { icon: <FileText size={12} />, text: 'Giữ in đậm & màu sắc' },
          { icon: <CheckCheck size={12} />, text: 'Tương thích 100% Word' },
          { icon: <Sparkles size={12} />, text: 'Quản lý lịch sử' },
        ].map(({ icon, text }) => (
          <span key={text} className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/40 shadow-sm px-3 py-1.5 rounded-full">
            <span className="text-indigo-500 dark:text-indigo-400">{icon}</span>
            {text}
          </span>
        ))}
      </div>
    </header>
  );
};

export default Header;
