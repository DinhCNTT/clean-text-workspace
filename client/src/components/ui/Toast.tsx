import React from 'react';
import { CheckCheck, AlertCircle } from 'lucide-react';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div className={`px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm backdrop-blur-md ${
        toast.type === 'success' 
          ? 'bg-emerald-50/90 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
          : toast.type === 'error'
          ? 'bg-red-50/90 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30'
          : 'bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
      }`}>
        {toast.type === 'success' ? <CheckCheck size={16} /> : toast.type === 'error' ? <AlertCircle size={16} /> : <div className="pulse-dot" />}
        {toast.message}
      </div>
    </div>
  );
};

export default Toast;
