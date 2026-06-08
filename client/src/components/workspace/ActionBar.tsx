import React, { forwardRef, useState } from 'react';
import { Trash2, Settings2, CheckCheck, Link2Off, Type, Wand2, ChevronRight, Clock } from 'lucide-react';
import type { CleanOptions } from '../../utils/htmlCleaner';

interface ActionBarProps {
  hasInput: boolean;
  outputHtml: string;
  isProcessing: boolean;
  cleanOptions: CleanOptions;
  setCleanOptions: React.Dispatch<React.SetStateAction<CleanOptions>>;
  currentUser: any;
  onClear: () => void;
  onClean: () => void;
  onSaveHistory: () => void;
}

const ActionBar = forwardRef<HTMLDivElement, ActionBarProps>(({
  hasInput, outputHtml, isProcessing, cleanOptions, setCleanOptions, currentUser, onClear, onClean, onSaveHistory
}, ref) => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div ref={ref} className="mt-8 flex flex-wrap justify-center items-center gap-4">
      <button
        onClick={onClear}
        disabled={!hasInput && !outputHtml}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold border border-slate-300 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={15} />
        Xóa trắng
      </button>

      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-full border shadow-sm transition-all duration-200 ${
            showSettings 
              ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-500/40' 
              : 'bg-white dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/80'
          }`}
          title="Tùy chọn làm sạch"
        >
          <Settings2 size={16} className={showSettings ? 'rotate-90 transition-transform' : 'transition-transform'} />
        </button>

        {showSettings && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/70 rounded-3xl p-5 shadow-2xl animate-slide-up z-50">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Settings2 size={16} className="text-indigo-500" /> Cài đặt nâng cao
              </h4>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="mt-0.5 relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={cleanOptions.removeLinks}
                      onChange={(e) => setCleanOptions(prev => ({...prev, removeLinks: e.target.checked}))}
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${cleanOptions.removeLinks ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                      <CheckCheck size={12} className={`text-white transition-all ${cleanOptions.removeLinks ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><Link2Off size={14} className="text-slate-400" /> Xóa tất cả liên kết</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Loại bỏ link (href) nhưng giữ lại chữ.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                  <div className="mt-0.5 relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={cleanOptions.plainTextOnly}
                      onChange={(e) => setCleanOptions(prev => ({...prev, plainTextOnly: e.target.checked}))}
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${cleanOptions.plainTextOnly ? 'bg-pink-500 border-pink-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                      <CheckCheck size={12} className={`text-white transition-all ${cleanOptions.plainTextOnly ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><Type size={14} className="text-slate-400" /> Chỉ giữ lại văn bản thô</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Xóa sạch màu sắc, in đậm, in nghiêng.</span>
                  </div>
                </label>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={onClean}
        disabled={!hasInput || isProcessing}
        className={`btn-primary inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-md ${
          hasInput && !isProcessing
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
            : 'bg-slate-100 dark:bg-slate-800/70 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50 cursor-not-allowed shadow-none'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Wand2 size={16} className={hasInput ? 'animate-pulse' : ''} />
            Làm sạch văn bản
            {hasInput && <ChevronRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />}
          </>
        )}
      </button>

      <button
        onClick={onSaveHistory}
        disabled={!outputHtml || isProcessing}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors text-sm font-semibold border border-slate-200 dark:border-slate-700/50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title={currentUser ? "Lưu vào lịch sử" : "Đăng nhập để lưu vào lịch sử"}
      >
        <Clock size={15} className={currentUser ? "text-indigo-500" : "text-slate-400"} />
        Lưu vào lịch sử
      </button>
    </div>
  );
});

ActionBar.displayName = 'ActionBar';
export default ActionBar;
