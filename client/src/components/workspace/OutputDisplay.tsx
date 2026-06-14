import React from 'react';
import { Sparkles, FileDown, CheckCheck, Copy } from 'lucide-react';
import { downloadFile } from '../../utils/download';

interface OutputDisplayProps {
  outputHtml: string;
  copySuccess: boolean;
  onCopy: () => void;
  showToast: (msg: string, type: 'success'|'error'|'info') => void;
  isProcessing?: boolean;
  progress?: number;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ 
  outputHtml, 
  copySuccess, 
  onCopy, 
  showToast,
  isProcessing = false,
  progress = 0
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between px-1 gap-2">
        <div className="label-tag bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/20 shadow-sm">
          <Sparkles size={12} />
          Văn bản đã làm sạch
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {outputHtml && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { downloadFile(outputHtml, 'doc'); showToast('Đã tải file Word (.doc)', 'success'); }}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-slate-600 border border-slate-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-700/50 dark:hover:text-indigo-400 dark:hover:bg-slate-700/80 dark:hover:border-indigo-500/50 transition-all shadow-sm"
                title="Tải xuống Word (.doc)"
              >
                <FileDown size={14} />
              </button>
              <button
                onClick={onCopy}
                className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full border shadow-sm transition-all duration-200 ${
                  copySuccess
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30 scale-95'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700/50 dark:hover:text-white dark:hover:border-slate-500 dark:hover:bg-slate-700/80'
                }`}
              >
                {copySuccess ? (
                  <><CheckCheck size={13} /> Đã copy!</>
                ) : (
                  <><Copy size={13} /> Sao chép sang Word</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
 
      <div className="glass-card-pink glow-pink rounded-3xl flex-1 relative overflow-hidden transition-all duration-300 min-h-[250px] md:min-h-[420px] flex flex-col">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="relative w-20 h-20 flex items-center justify-center mb-3">
              <div className="absolute inset-0 border-4 border-indigo-100 dark:border-slate-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{progress}%</span>
            </div>
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-semibold mb-1 text-sm md:text-base">Đang dọn dẹp văn bản ngầm...</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Hàng đợi BullMQ đang xử lý tài liệu</p>
            </div>
            
            <div className="w-44 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {outputHtml ? (
          <div
            id="output-display"
            className="content-area w-full flex-1 p-4 md:p-6 rounded-3xl overflow-y-auto animate-fade-in leading-relaxed text-[15px] md:text-base"
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-8 gap-4 py-8">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center shadow-sm">
              <Sparkles size={28} className="text-pink-500 dark:text-pink-400/60" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Kết quả sẽ xuất hiện ở đây</p>
              <p className="text-slate-500 dark:text-slate-600 text-xs mt-1">Dán văn bản và bấm "Làm sạch" để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
