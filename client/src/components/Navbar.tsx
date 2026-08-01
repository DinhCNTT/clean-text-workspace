import React, { useState } from 'react';
import { Clock, User, LogOut, Sun, Moon, Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentUser: any;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenHistory: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isDarkMode,
  toggleTheme,
  onOpenHistory,
  onOpenAuth,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tính năng', href: '#features' },
    { label: 'Bàn làm việc', href: '#workspace' },
    { label: 'So sánh', href: '#comparison' },
    { label: 'Bảng giá', href: '#pricing' },
    { label: 'Hỏi AI', href: '#ai-preview' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Tác giả', href: '#author' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 80; // height of sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 glass-navbar transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#home" 
          onClick={(e) => handleScroll(e, '#home')}
          className="flex items-center gap-2 font-black text-lg tracking-tight select-none"
        >
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="hero-gradient-text">Clean Text</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* User controls & Theme toggle */}
        <div className="hidden lg:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenHistory}
                className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/25 transition-all font-semibold text-xs shadow-sm"
                title="Lịch sử"
              >
                <Clock size={14} /> 
                <span>Lịch sử</span>
              </button>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm px-3.5 py-1.5 rounded-full">
                <User size={14} className="text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">{currentUser.username}</span>
                <button
                  onClick={onLogout}
                  className="ml-1 text-slate-400 hover:text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 transition-all px-4 py-2 rounded-full text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-xs cursor-pointer"
            >
              <User size={14} />
              <span>Đăng nhập</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            title={isDarkMode ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile controls & toggle button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-indigo-600"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-4 animate-fade-in shadow-xl">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-1" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full">
                  <User size={14} className="text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{currentUser.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onOpenHistory(); }}
                    className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full text-xs font-semibold"
                  >
                    <Clock size={12} /> Lịch sử
                  </button>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}
                    className="p-1.5 rounded-full text-slate-400 hover:text-red-500 border border-transparent"
                    title="Đăng xuất"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 border border-slate-200 dark:border-slate-700 shadow-sm transition-all px-4 py-2 w-full justify-center rounded-full text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                <User size={14} />
                <span>Đăng nhập tài khoản</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
