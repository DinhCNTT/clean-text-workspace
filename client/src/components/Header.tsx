import React from 'react';
import { ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  const handleScrollToWorkspace = (e: React.MouseEvent) => {
    e.preventDefault();
    const workspaceElement = document.querySelector('#workspace');
    if (workspaceElement) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = workspaceElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresElement = document.querySelector('#features');
    if (featuresElement) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = featuresElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header id="home" className="relative min-h-[65vh] md:min-h-[70vh] flex flex-col justify-center items-center text-center px-6 py-12 md:py-20 overflow-hidden bg-mesh">
      {/* Subtle background ambient blob for decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none select-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-6">
        
        {/* Support Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50/55 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-sm select-none">
          <div className="pulse-dot" />
          Hỗ trợ Rich Text từ Gemini, ChatGPT & PDF
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight max-w-3xl">
          Định dạng lại văn bản lỗi từ AI & PDF{' '}
          <span className="hero-gradient-text">trong 1 giây</span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Xóa sạch phông xám, bullet chéo và thẻ rác. Giữ nguyên in đậm, màu sắc nguyên bản để dán vào Microsoft Word hoàn hảo không lỗi căn lề.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
          <a
            href="#workspace"
            onClick={handleScrollToWorkspace}
            className="btn-gradient flex items-center justify-center gap-2 px-8 py-3.5 w-full sm:w-auto rounded-full font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-all duration-200"
          >
            <span>Bắt đầu làm sạch</span>
            <ArrowRight size={16} />
          </a>
          <a
            href="#features"
            onClick={handleScrollToFeatures}
            className="flex items-center justify-center gap-2 px-6 py-3.5 w-full sm:w-auto rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200"
          >
            <span>Xem tính năng</span>
          </a>
        </div>

        {/* Hero Illustration / Dashboard Preview */}
        <div className="mt-12 w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl relative group hover:scale-[1.01] transition-transform duration-500 bg-white/50 dark:bg-slate-900/50 p-2.5">
          <img 
            src="/hero_illustration.png" 
            alt="Clean Text SaaS Dashboard Preview" 
            className="w-full h-auto rounded-2xl object-cover"
          />
        </div>

      </div>
    </header>
  );
};

export default Header;
