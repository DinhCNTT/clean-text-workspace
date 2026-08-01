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
    <div ref={ref} className="mt-6 flex flex-wrap justify-center items-center gap-3 select-none">
      <button
        onClick={onClear}
        disabled={!hasInput && !outputHtml}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 size={13} />
        Xóa trắng
      </button>

      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2.5 rounded-full border shadow-sm transition-all cursor-pointer ${
            showSettings 
              ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-405 border-indigo-200 dark:border-indigo-900' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
          title="Tùy chọn làm sạch"
        >
          <Settings2 size={14} className={showSettings ? 'rotate-45 transition-transform' : 'transition-transform'} />
        </button>

        {showSettings && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-xl animate-fade-in z-50">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Settings2 size={14} className="text-indigo-500" /> Tùy chọn làm sạch
              </h4>
              
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border border-transparent">
                  <div className="mt-0.5 relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={cleanOptions.removeLinks}
                      onChange={(e) => setCleanOptions(prev => ({...prev, removeLinks: e.target.checked}))}
                    />
                    <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${cleanOptions.removeLinks ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                      <CheckCheck size={10} className={`text-white transition-all ${cleanOptions.removeLinks ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><Link2Off size={12} className="text-slate-400" /> Xóa liên kết ẩn</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Xóa link (href) nhưng giữ lại văn bản hiển thị.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border border-transparent">
                  <div className="mt-0.5 relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      checked={cleanOptions.plainTextOnly}
                      onChange={(e) => setCleanOptions(prev => ({...prev, plainTextOnly: e.target.checked}))}
                    />
                    <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${cleanOptions.plainTextOnly ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}>
                      <CheckCheck size={10} className={`text-white transition-all ${cleanOptions.plainTextOnly ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><Type size={12} className="text-slate-400" /> Chỉ lấy chữ thô</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Xóa hoàn toàn định dạng màu sắc, in đậm, in nghiêng.</span>
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
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all duration-205 shadow-sm cursor-pointer ${
          hasInput && !isProcessing
            ? 'btn-gradient'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            <Wand2 size={14} className={hasInput ? 'animate-pulse' : ''} />
            Làm sạch văn bản
            {hasInput && <ChevronRight size={12} />}
          </>
        )}
      </button>

      <button
        onClick={onSaveHistory}
        disabled={!outputHtml || isProcessing}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title={currentUser ? "Lưu vào lịch sử" : "Đăng nhập để lưu vào lịch sử"}
      >
        <Clock size={13} className={currentUser ? "text-indigo-500" : "text-slate-400"} />
        Lưu vào lịch sử
      </button>
    </div>
  );
});

ActionBar.displayName = 'ActionBar';
export default ActionBar;
