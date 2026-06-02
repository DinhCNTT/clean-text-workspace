import React from 'react';
import { Clock, User, LogOut, Sun, Moon } from 'lucide-react';

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
  return (
    <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
      {currentUser ? (
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all font-semibold text-sm shadow-sm"
          >
            <Clock size={16} /> Lịch sử
          </button>
          <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm px-4 py-2 rounded-full backdrop-blur-md">
            <User size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{currentUser.username}</span>
            <button
              onClick={onLogout}
              className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 px-4 py-2 rounded-full backdrop-blur-md text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm"
        >
          <User size={16} />
          Đăng nhập
        </button>
      )}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 backdrop-blur-md text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 group"
        title={isDarkMode ? "Chuyển sang Giao diện Sáng" : "Chuyển sang Giao diện Tối"}
      >
        {isDarkMode ? (
          <Sun size={20} className="transition-transform group-hover:rotate-45" />
        ) : (
          <Moon size={20} className="transition-transform group-hover:-rotate-12" />
        )}
      </button>
    </div>
  );
};

export default Navbar;
