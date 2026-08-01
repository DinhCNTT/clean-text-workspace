import React from 'react';
import type { RefObject } from 'react';
import { ClipboardPaste, Sparkles } from 'lucide-react';

interface InputEditorProps {
  inputRef: RefObject<HTMLDivElement | null>;
  hasInput: boolean;
  onInput: () => void;
}

const InputEditor: React.FC<InputEditorProps> = ({ inputRef, hasInput, onInput }) => {
  
  const handleLoadExample = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    
    // Rich text mock copy-paste from ChatGPT/Gemini
    const exampleHtml = `
<div style="background-color: rgba(241, 245, 249, 0.9); border-radius: 8px; padding: 16px; font-family: ui-sans-serif, system-ui; color: #334155; line-height: 1.6;">
  <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 8px; font-size: 16px; font-weight: 700;">Ví dụ văn bản lỗi định dạng (từ ChatGPT):</h3>
  <p style="margin-bottom: 12px;">Đoạn văn này có <span style="background-color: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: bold;">nền đỏ cảnh báo</span> và phông nền xám nhạt khó chịu của chatbot AI.</p>
  <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
    <li style="margin-bottom: 6px;">● <b>Bullet rác:</b> Ký tự tròn đen kết hợp thụt lề sai cách.</li>
    <li style="margin-bottom: 6px;">● <b>Liên kết ẩn:</b> <a href="https://github.com/DinhCNTT" style="color: #2563eb; text-decoration: underline;">https://github.com/DinhCNTT</a> (Cần được lọc bớt URL).</li>
    <li style="margin-bottom: 0;">● <i>Định dạng nghiêng:</i> In nghiêng giữ nguyên khi xuất bản.</li>
  </ul>
</div>
    `.trim();

    inputRef.current.innerHTML = exampleHtml;
    // Trigger state change
    onInput();
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between px-1 gap-2 select-none">
        <div className="label-tag">
          <ClipboardPaste size={12} />
          Văn bản đầu vào
        </div>
        
        <button
          onClick={handleLoadExample}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          title="Dán nhanh một văn bản mẫu bị lỗi để chạy thử nghiệm"
        >
          <Sparkles size={12} />
          Dán văn bản mẫu
        </button>
      </div>

      <div className="clean-card rounded-3xl flex-1 relative overflow-hidden transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:focus-within:border-indigo-500/30 focus-within:-translate-y-0.5">
        <div
          ref={inputRef}
          id="input-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          className="content-area w-full min-h-[250px] md:min-h-[420px] p-4 md:p-6 rounded-3xl overflow-y-auto focus:outline-none leading-relaxed text-[15px] md:text-base"
          data-placeholder="Dán văn bản lỗi vào đây hoặc bấm 'Dán văn bản mẫu' ở phía trên để thử nghiệm..."
        />
        {!hasInput && (
          <div className="absolute top-6 left-6 text-slate-400 dark:text-slate-500 text-sm pointer-events-none select-none flex items-center gap-2">
            <ClipboardPaste size={16} className="text-indigo-450/40" />
            Dán văn bản bị lỗi vào đây (Ctrl+V)...
          </div>
        )}
      </div>
    </div>
  );
};

export default InputEditor;
