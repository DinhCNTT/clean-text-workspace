import { useRef, useState, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useScroll } from './hooks/useScroll';
import { useWorkspace } from './hooks/useWorkspace';

import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HistoryDrawer from './components/HistoryDrawer';

import InputEditor from './components/workspace/InputEditor';
import OutputDisplay from './components/workspace/OutputDisplay';
import ActionBar from './components/workspace/ActionBar';
import FloatingNav from './components/ui/FloatingNav';
import Toast from './components/ui/Toast';

function App() {
  const inputRef = useRef<HTMLDivElement>(null);
  const actionBarRef = useRef<HTMLDivElement>(null);
  const workspaceTopRef = useRef<HTMLDivElement>(null);

  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, handleAuthSuccess, handleLogout } = useAuth();
  const scrollPosition = useScroll(workspaceTopRef, actionBarRef);
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const {
    outputHtml, setOutputHtml,
    hasInput, copySuccess, isProcessing,
    cleanOptions, setCleanOptions,
    handleInput, handleClean, handleCopy, handleSaveHistory, handleClear
  } = useWorkspace({
    inputRef,
    showToast,
    currentUser,
    onOpenAuth: () => setIsAuthModalOpen(true)
  });

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
        <div ref={workspaceTopRef} className="grid lg:grid-cols-2 gap-6 relative">
          <InputEditor 
            inputRef={inputRef} 
            hasInput={hasInput} 
            onInput={handleInput} 
          />
          
          {/* ── DESKTOP MIDDLE QUICK CLEAN BUTTON ── */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleClean}
              disabled={!hasInput || isProcessing}
              className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl border-4 transition-all duration-300 ${
                hasInput && !isProcessing
                  ? 'bg-gradient-to-br from-indigo-500 to-pink-500 border-white dark:border-slate-800 text-white hover:scale-110 hover:shadow-indigo-500/40 hover:rotate-12'
                  : 'bg-slate-100 dark:bg-slate-700 border-white dark:border-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              title="Làm sạch nhanh"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={hasInput ? 'animate-pulse' : ''}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
              )}
            </button>
          </div>

          <OutputDisplay 
            outputHtml={outputHtml} 
            copySuccess={copySuccess} 
            onCopy={handleCopy} 
            showToast={showToast} 
          />
        </div>

        {/* ── ACTION BAR ── */}
        <ActionBar
          ref={actionBarRef}
          hasInput={hasInput}
          outputHtml={outputHtml}
          isProcessing={isProcessing}
          cleanOptions={cleanOptions}
          setCleanOptions={setCleanOptions}
          currentUser={currentUser}
          onClear={handleClear}
          onClean={handleClean}
          onSaveHistory={handleSaveHistory}
        />

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

      <Toast toast={toast} />
      
      <FloatingNav scrollPosition={scrollPosition} actionBarRef={actionBarRef} />
    </div>
  );
}

export default App;
