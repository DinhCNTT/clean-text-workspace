import { useState, useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import { cleanHtmlUtils } from '../utils/htmlCleaner';
import type { CleanOptions } from '../utils/htmlCleaner';
import { copyRichTextToClipboard } from '../utils/clipboard';

interface UseWorkspaceProps {
  inputRef: RefObject<HTMLDivElement | null>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  currentUser: any;
  onOpenAuth: () => void;
}

export function useWorkspace({ inputRef, showToast, currentUser, onOpenAuth }: UseWorkspaceProps) {
  const debounceTimeoutRef = useRef<any>(null);
  const [outputHtml, setOutputHtml] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [cleanOptions, setCleanOptions] = useState<CleanOptions>(() => {
    const saved = localStorage.getItem('cleanSettings');
    return saved ? JSON.parse(saved) : { removeLinks: false, plainTextOnly: false };
  });

  useEffect(() => {
    localStorage.setItem('cleanSettings', JSON.stringify(cleanOptions));
  }, [cleanOptions]);

  useEffect(() => {
    const savedInput = localStorage.getItem('draft_input');
    const savedOutput = localStorage.getItem('draft_output');
    
    if (savedInput && inputRef.current) {
      inputRef.current.innerHTML = savedInput;
      setHasInput(true);
    }
    if (savedOutput) {
      setOutputHtml(savedOutput);
    }
  }, [inputRef]);

  const handleInput = useCallback(() => {
    if (!inputRef.current) return;
    
    const text = inputRef.current.innerText.trim();
    setHasInput(text.length > 0);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        const html = inputRef.current.innerHTML;
        localStorage.setItem('draft_input', html);
      }
    }, 300);
  }, [inputRef]);

  const handleClean = useCallback(() => {
    if (!inputRef.current || !hasInput) return;
    setIsProcessing(true);
    setTimeout(() => {
      const rawHtml = inputRef.current!.innerHTML;
      const cleaned = cleanHtmlUtils(rawHtml, cleanOptions);
      setOutputHtml(cleaned);
      localStorage.setItem('draft_output', cleaned);
      setIsProcessing(false);
    }, 200);
  }, [hasInput, cleanOptions, inputRef]);

  const handleCopy = useCallback(async () => {
    if (!outputHtml) return;
    try {
      await copyRichTextToClipboard(outputHtml);
      setCopySuccess(true);
      showToast('Đã copy vào Clipboard!', 'success');
      setTimeout(() => setCopySuccess(false), 2500);
    } catch {
      showToast('Không thể copy tự động. Hãy bôi đen và dùng Ctrl+C.', 'error');
    }
  }, [outputHtml, showToast]);

  const handleSaveHistory = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    
    if (!outputHtml) {
      showToast('Không có nội dung để lưu!', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contentHtml: outputHtml
        })
      });

      if (!res.ok) throw new Error('Không thể lưu');
      
      showToast('Đã lưu vào lịch sử thành công!', 'success');
    } catch (error) {
      showToast('Lỗi khi lưu vào lịch sử. Vui lòng thử lại.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.innerHTML = '';
    }
    setHasInput(false);
    setOutputHtml('');
    setCopySuccess(false);
    localStorage.removeItem('draft_input');
    localStorage.removeItem('draft_output');
    showToast('Đã xóa sạch bàn làm việc', 'info');
  }, [inputRef, showToast]);

  return {
    outputHtml, setOutputHtml,
    hasInput,
    copySuccess,
    isProcessing,
    cleanOptions, setCleanOptions,
    handleInput, handleClean, handleCopy, handleSaveHistory, handleClear
  };
}
