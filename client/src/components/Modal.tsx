import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, icon, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/80 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between mb-6 relative z-10 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5 text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 dark:from-indigo-400 dark:to-pink-400">
             {icon}
             {title}
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
            <X size={18} />
          </button>
        </div>
        <div className="relative z-10 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
