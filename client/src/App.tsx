import { useRef, useState, useCallback, useEffect } from 'react';
import {
  Wand2, Copy, Trash2, ClipboardPaste, CheckCheck,
  Sparkles, Clock, ChevronRight, AlertCircle,
  Settings2, FileDown, Link2Off, Type
} from 'lucide-react';
import { cleanHtmlUtils } from './utils/htmlCleaner';
import { copyRichTextToClipboard } from './utils/clipboard';
import { downloadFile } from './utils/download';
import type { CleanOptions } from './utils/htmlCleaner';
import AuthModal from './components/AuthModal';
import HistoryDrawer from './components/HistoryDrawer';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const inputRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<any>(null);
  const [outputHtml, setOutputHtml] = useState('');
  const [hasInput, setHasInput] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Custom Toast State
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [cleanOptions, setCleanOptions] = useState<CleanOptions>(() => {
    const saved = localStorage.getItem('cleanSettings');
    return saved ? JSON.parse(saved) : { removeLinks: false, plainTextOnly: false };
  });

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('cleanSettings', JSON.stringify(cleanOptions));
  }, [cleanOptions]);

  // Load auto-save draft
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
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAuthSuccess = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Theme State (Dark Mode Default)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleInput = useCallback(() => {
    if (!inputRef.current) return;
    
    const text = inputRef.current.innerText.trim();
    setHasInput(text.length > 0);

    // Debounce the heavy word count logic to avoid main thread blocking
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        const html = inputRef.current.innerHTML;
        localStorage.setItem('draft_input', html);
      }
    }, 300);
  }, []);

  const handleClean = useCallback(() => {
    if (!inputRef.current || !hasInput) return;
    setIsProcessing(true);
    // Small delay for animation feedback
    setTimeout(() => {
      const rawHtml = inputRef.current!.innerHTML;
      const cleaned = cleanHtmlUtils(rawHtml, cleanOptions);
      setOutputHtml(cleaned);
      localStorage.setItem('draft_output', cleaned);
      setIsProcessing(false);
    }, 200);
  }, [hasInput, cleanOptions]);

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
      setIsAuthModalOpen(true);
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
  }, [showToast]);

  return (
    <div className="min-h-screen bg-mesh font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ── THEME TOGGLE & AUTH ── */}
      <Navbar 
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* ── HEADER ── */}
      <Header />

      {/* ── MAIN WORKSPACE ── */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-6 relative">
          
          {/* ── INPUT PANEL ── */}
          <div className="flex flex-col gap-3">
            {/* Panel header */}
            <div className="flex items-center justify-between px-1">
              <div className="label-tag bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
                <ClipboardPaste size={12} />
                Dán văn bản vào đây
              </div>

            </div>

            {/* Editor box */}
            <div className="glass-card glow-indigo rounded-3xl flex-1 relative overflow-hidden
                            transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/20 dark:focus-within:border-indigo-500/30">
              <div
                ref={inputRef}
                id="input-editor"
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="content-area w-full min-h-[420px] p-6 rounded-3xl overflow-y-auto focus:outline-none"
                style={{ minHeight: '420px' }}
                data-placeholder="Dán (Ctrl+V) đoạn văn bản bị lỗi vào đây..."
              />
              {/* Placeholder CSS trick */}
              {!hasInput && (
                <div className="absolute top-6 left-6 text-slate-400 text-sm pointer-events-none select-none flex items-center gap-2">
                  <ClipboardPaste size={16} className="text-indigo-400/60" />
                  Dán văn bản bị lỗi vào đây (Ctrl+V)...
                </div>
              )}
            </div>
          </div>

          {/* ── OUTPUT PANEL ── */}
          <div className="flex flex-col gap-3">
            {/* Panel header */}
            <div className="flex items-center justify-between px-1">
              <div className="label-tag bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-500/20 shadow-sm">
                <Sparkles size={12} />
                Văn bản đã làm sạch
              </div>
              <div className="flex items-center gap-3">

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
                      onClick={handleCopy}
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

            {/* Result box */}
            <div className="glass-card-pink glow-pink rounded-3xl flex-1 relative overflow-hidden transition-all duration-300">
              {outputHtml ? (
                <div
                  id="output-display"
                  className="content-area w-full min-h-[420px] p-6 rounded-3xl overflow-y-auto animate-fade-in"
                  dangerouslySetInnerHTML={{ __html: outputHtml }}
                  style={{ minHeight: '420px' }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[420px] text-center px-8 gap-4">
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
        </div>

        {/* ── ACTION BAR ── */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          {/* Clear button */}
          <button
            onClick={handleClear}
            disabled={!hasInput && !outputHtml}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-semibold border border-slate-300 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={15} />
            Xóa trắng
          </button>

          {/* Settings Popup */}
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

          {/* Main CTA */}
          <button
            onClick={handleClean}
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

          {/* Save to history */}
          <button
            onClick={handleSaveHistory}
            disabled={!outputHtml || isProcessing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors text-sm font-semibold border border-slate-200 dark:border-slate-700/50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title={currentUser ? "Lưu vào lịch sử" : "Đăng nhập để lưu vào lịch sử"}
          >
            <Clock size={15} className={currentUser ? "text-indigo-500" : "text-slate-400"} />
            Lưu vào lịch sử
          </button>
        </div>

        {/* ── TIPS ── */}
        <div className="mt-10 text-center bg-white/50 dark:bg-slate-800/30 p-4 rounded-2xl max-w-2xl mx-auto border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm">
          <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">
            💡 Mẹo: Bạn có thể dán thẳng từ&nbsp;
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Gemini</span>,&nbsp;
            <span className="text-slate-800 dark:text-slate-200 font-semibold">ChatGPT</span>,&nbsp;
            <span className="text-slate-800 dark:text-slate-200 font-semibold">Google Docs</span>&nbsp;hay&nbsp;
            <span className="text-slate-800 dark:text-slate-200 font-semibold">PDF</span>&nbsp;—&nbsp;
            định dạng màu sắc, in đậm sẽ được giữ nguyên.
          </p>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <Footer />

      {/* ── GLOBAL COMPONENTS ── */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onSelect={(html) => {
          setOutputHtml(html);
          setIsHistoryDrawerOpen(false);
          showToast('Đã tải lịch sử', 'success');
        }}
      />

      {/* ── TOAST ── */}
      {toast && (
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
      )}
    </div>
  );
}

export default App;
