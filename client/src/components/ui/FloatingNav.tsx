import React from 'react';
import type { RefObject } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FloatingNavProps {
  scrollPosition: 'top' | 'bottom' | 'middle' | 'none';
  actionBarRef: RefObject<HTMLElement | null>;
}

const FloatingNav: React.FC<FloatingNavProps> = ({ scrollPosition, actionBarRef }) => {
  if (scrollPosition === 'none') return null;

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 flex flex-col gap-2 md:gap-3 z-50 animate-fade-in">
      {(scrollPosition === 'bottom' || scrollPosition === 'middle') && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200"
          title="Lên trên cùng"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
      {(scrollPosition === 'top' || scrollPosition === 'middle') && (
        <button
          onClick={() => {
            if (actionBarRef.current) {
              const y = actionBarRef.current.getBoundingClientRect().top + window.scrollY - 100;
              window.scrollTo({ top: y, behavior: 'auto' });
            } else {
              window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'auto' });
            }
          }}
          className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700 hover:scale-105 transition-all duration-200"
          title="Xuống thanh công cụ"
        >
          <ArrowDown className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingNav;
