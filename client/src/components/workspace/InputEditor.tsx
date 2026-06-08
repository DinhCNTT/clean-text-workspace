import React from 'react';
import type { RefObject } from 'react';
import { ClipboardPaste } from 'lucide-react';

interface InputEditorProps {
  inputRef: RefObject<HTMLDivElement | null>;
  hasInput: boolean;
  onInput: () => void;
}

const InputEditor: React.FC<InputEditorProps> = ({ inputRef, hasInput, onInput }) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between px-1 gap-2">
        <div className="label-tag bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
          <ClipboardPaste size={12} />
          Dán văn bản vào đây
        </div>
      </div>

      <div className="glass-card glow-indigo rounded-3xl flex-1 relative overflow-hidden transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 dark:focus-within:border-indigo-500/30 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.2)] dark:focus-within:shadow-[0_0_30px_rgba(99,102,241,0.15)] focus-within:-translate-y-1">
        <div
          ref={inputRef}
          id="input-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={onInput}
          className="content-area w-full min-h-[250px] md:min-h-[420px] p-4 md:p-6 rounded-3xl overflow-y-auto focus:outline-none leading-relaxed text-[15px] md:text-base"
          data-placeholder="Dán (Ctrl+V) đoạn văn bản bị lỗi vào đây..."
        />
        {!hasInput && (
          <div className="absolute top-6 left-6 text-slate-400 text-sm pointer-events-none select-none flex items-center gap-2">
            <ClipboardPaste size={16} className="text-indigo-400/60" />
            Dán văn bản bị lỗi vào đây (Ctrl+V)...
          </div>
        )}
      </div>
    </div>
  );
};

export default InputEditor;
