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
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between px-1 gap-2 select-none">
        <div className="label-tag">
          <Sparkles size={12} />
          Kết quả làm sạch
        </div>
        
        {outputHtml && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => { downloadFile(outputHtml, 'doc'); showToast('Đã tải file Word (.doc)', 'success'); }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:hover:bg-slate-700/80 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all shadow-sm cursor-pointer"
              title="Tải xuống Word (.doc)"
            >
              <FileDown size={14} />
            </button>
            <button
              onClick={onCopy}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border shadow-sm transition-all duration-200 cursor-pointer ${
                copySuccess
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {copySuccess ? (
                <><CheckCheck size={12} /> Đã copy!</>
              ) : (
                <><Copy size={12} /> Sao chép Word</>
              )}
            </button>
          </div>
        )}
      </div>
 
      <div className="clean-card rounded-3xl flex-1 relative overflow-hidden min-h-[250px] md:min-h-[420px] flex flex-col">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="relative w-16 h-16 flex items-center justify-center mb-3">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{progress}%</span>
            </div>
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">Đang dọn dẹp văn bản...</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Tiến trình đang được xử lý bởi hàng đợi BullMQ</p>
            </div>
            
            <div className="w-36 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {outputHtml ? (
          <div
            id="output-display"
            className="content-area w-full flex-1 p-4 md:p-6 rounded-3xl overflow-y-auto leading-relaxed text-[15px] md:text-base"
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-8 gap-4 py-8 select-none">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/20 flex items-center justify-center shadow-sm">
              <Sparkles size={20} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">Kết quả sẽ xuất hiện ở đây</p>
              <p className="text-slate-500 dark:text-slate-600 text-xs mt-0.5">Dán văn bản lỗi bên trái và nhấn "Làm sạch"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
