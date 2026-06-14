import { useState, useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
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

  const [progress, setProgress] = useState(0);

  const handleClean = useCallback(async () => {
    if (!inputRef.current || !hasInput) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    const rawHtml = inputRef.current.innerHTML;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    try {
      // 1. Gửi yêu cầu bắt đầu xử lý bất đồng bộ
      const res = await fetch(`${API_URL}/jobs/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          rawHtml,
          options: cleanOptions
        })
      });
      
      if (!res.ok) {
        throw new Error('Không thể khởi tạo tiến trình xử lý.');
      }
      
      const { jobId } = await res.json();
      
      // 2. Lắng nghe tiến trình qua Server-Sent Events (SSE)
      const eventSource = new EventSource(`${API_URL}/jobs/${jobId}/progress`, {
        withCredentials: true
      });
      
      eventSource.addEventListener('progress', (e: any) => {
        const data = JSON.parse(e.data);
        setProgress(data.progress || 0);
      });
      
      eventSource.addEventListener('completed', (e: any) => {
        const data = JSON.parse(e.data);
        setOutputHtml(data.cleanedHtml);
        localStorage.setItem('draft_output', data.cleanedHtml);
        showToast('Làm sạch văn bản thành công!', 'success');
        setIsProcessing(false);
        setProgress(100);
        eventSource.close();
      });
      
      eventSource.addEventListener('failed', (e: any) => {
        const data = JSON.parse(e.data);
        showToast(data.error || 'Lỗi xử lý ngầm.', 'error');
        setIsProcessing(false);
        eventSource.close();
      });

      eventSource.addEventListener('error', () => {
        showToast('Lỗi đường truyền hoặc tiến trình bị ngắt.', 'error');
        setIsProcessing(false);
        eventSource.close();
      });
      
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi gửi yêu cầu.', 'error');
      setIsProcessing(false);
    }
  }, [hasInput, cleanOptions, inputRef, showToast]);

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
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
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
    progress,
    cleanOptions, setCleanOptions,
    handleInput, handleClean, handleCopy, handleSaveHistory, handleClear
  };
}
