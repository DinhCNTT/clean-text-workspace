import { useRef, useState, useCallback, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useScroll } from './hooks/useScroll';
import { useWorkspace } from './hooks/useWorkspace';
import { 
  Sparkles, Zap, FileText, Code, ShieldCheck, 
  MessageSquare, Send, CheckCheck, Award, ArrowRight,
  Star, Check
} from 'lucide-react';

import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import HistoryDrawer from './components/HistoryDrawer';
import ChatDrawer from './components/ChatDrawer';

import InputEditor from './components/workspace/InputEditor';
import OutputDisplay from './components/workspace/OutputDisplay';
import ActionBar from './components/workspace/ActionBar';
import FloatingNav from './components/ui/FloatingNav';
import Toast from './components/ui/Toast';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 1500, decimals = 0, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(progress * end);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  const formatted = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span ref={elementRef}>{formatted}{suffix}</span>;
};

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Form liên hệ/góp ý trực tiếp trên trang
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const {
    outputHtml, setOutputHtml,
    hasInput, copySuccess, isProcessing, progress,
    cleanOptions, setCleanOptions,
    handleInput, handleClean, handleCopy, handleSaveHistory, handleClear
  } = useWorkspace({
    inputRef,
    showToast,
    currentUser,
    onOpenAuth: () => setIsAuthModalOpen(true)
  });

  // Intersection Observer trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Xử lý gửi góp ý trực tiếp trên Landing Page
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMsg.trim() || feedbackStatus === 'sending') return;

    setFeedbackStatus('sending');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedbackMsg })
      });

      if (res.ok) {
        setFeedbackStatus('success');
        setFeedbackMsg('');
        showToast('Cảm ơn bạn đã gửi ý kiến đóng góp!', 'success');
        setTimeout(() => setFeedbackStatus('idle'), 5000);
      } else {
        throw new Error();
      }
    } catch {
      setFeedbackStatus('error');
      showToast('Không thể gửi góp ý, vui lòng thử lại sau.', 'error');
      setTimeout(() => setFeedbackStatus('idle'), 4000);
    }
  };

  const faqItems = [
    {
      q: "Clean Text Workspace hoạt động như thế nào?",
      a: "Ứng dụng lọc toàn bộ các thẻ HTML dư thừa, kiểu phông chữ nền xám, các class định dạng của Chatbot AI (Gemini, ChatGPT) và PDF. Toàn bộ quá trình được xếp hàng đợi qua BullMQ + Redis dưới máy chủ và truyền dữ liệu thời gian thực tới bạn."
    },
    {
      q: "Tôi có bị mất định dạng in đậm, in nghiêng hay màu chữ không?",
      a: "Không. Clean Text bảo toàn các kiểu định dạng quan trọng như in đậm (bold), in nghiêng (italic) và màu sắc chữ để giữ nguyên điểm nhấn chính của bạn khi dán vào Microsoft Word."
    },
    {
      q: "Làm thế nào để chatbot AI tích hợp có thể đọc được tài liệu của tôi?",
      a: "Khi bạn tiến hành dọn dẹp tài liệu, nội dung văn bản sẽ được lưu tạm thời. Nhờ Pinecone Vector DB và mô hình ngôn ngữ lớn, chatbot có thể tìm kiếm nhanh ngữ cảnh liên quan và trả lời chính xác câu hỏi của bạn về tài liệu đó."
    },
    {
      q: "Công cụ này có bảo mật thông tin của tôi không?",
      a: "Có. Chúng tôi cam kết bảo mật 100% dữ liệu. Lịch sử làm sạch văn bản chỉ được lưu trữ an toàn trên Database khi bạn đã đăng nhập và chủ động nhấn nút 'Lưu vào lịch sử'."
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Khánh Linh",
      role: "Copywriter & Content Creator",
      text: "Trước đây mình mất hàng giờ để xóa nền xám và định dạng lại thụt lề khi copy bài viết từ ChatGPT sang Word. Từ khi có Clean Text, mọi thứ xong chỉ trong 1 giây!",
      stars: 5
    },
    {
      name: "Trần Minh Đức",
      role: "Sinh viên Đại học Bách Khoa",
      text: "Tính năng Hỏi AI cực kỳ hữu ích. Mình chỉ cần dán bài nghiên cứu khoa học từ PDF vào làm sạch rồi trực tiếp chat hỏi tóm tắt các đề mục lớn luôn.",
      stars: 5
    },
    {
      name: "Lê Hoàng Nam",
      role: "Nhà báo & Biên dịch viên",
      text: "Văn bản giữ nguyên in đậm và in nghiêng chuẩn xác. Tôi có thể tải trực tiếp file .doc về máy tính và chỉnh sửa tiếp trên MS Word rất tiện lợi.",
      stars: 5
    }
  ];

  const stats = [
    { end: 10000, decimals: 0, suffix: "+", label: "Tài liệu được xử lý" },
    { end: 99.9, decimals: 1, suffix: "%", label: "Độ chuẩn xác định dạng" },
    { end: 0.2, decimals: 1, suffix: "s", label: "Tốc độ xử lý trung bình" },
    { end: 5000, decimals: 0, suffix: "+", label: "Người dùng tin cậy" }
  ];

  return (
    <div className="min-h-screen bg-mesh font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ── STICKY NAVBAR ── */}
      <Navbar 
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onOpenHistory={() => setIsHistoryDrawerOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* ── HERO SECTION ── */}
      <Header />

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6">
        
        {/* ── SECTION 1: WORKSPACE ── */}
        <section id="workspace" className="py-12 md:py-20 scroll-mt-16">
          <div className="text-center mb-10 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Bàn Làm Việc</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Dán tài liệu thô bên trái và nhận văn bản sạch bên phải</p>
          </div>
          
          <div ref={workspaceTopRef} className="grid lg:grid-cols-2 gap-6 relative">
            <InputEditor 
              inputRef={inputRef} 
              hasInput={hasInput} 
              onInput={handleInput} 
            />
            
            {/* ── DESKTOP MIDDLE QUICK CLEAN BUTTON ── */}
            <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 select-none">
              <button
                onClick={handleClean}
                disabled={!hasInput || isProcessing}
                className={`flex items-center justify-center w-12 h-12 rounded-full shadow-md border-4 transition-all duration-300 cursor-pointer ${
                  hasInput && !isProcessing
                    ? 'bg-indigo-600 border-white dark:border-slate-800 text-white hover:scale-110 hover:bg-indigo-700'
                    : 'bg-slate-100 dark:bg-slate-700 border-white dark:border-slate-800 text-slate-400 cursor-not-allowed'
                }`}
                title="Làm sạch nhanh"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={hasInput ? 'animate-pulse' : ''}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>
                )}
              </button>
            </div>

            <OutputDisplay 
              outputHtml={outputHtml} 
              copySuccess={copySuccess} 
              onCopy={handleCopy} 
              showToast={showToast} 
              isProcessing={isProcessing}
              progress={progress}
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
          
          {/* Tip info */}
          <div className="mt-8 text-center bg-white/50 dark:bg-slate-800/20 p-4 rounded-2xl max-w-xl mx-auto border border-slate-200/50 dark:border-slate-800/30 select-none">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              💡 Mẹo: Định dạng màu sắc, in đậm, in nghiêng sẽ được bảo lưu. Bạn có thể dán thẳng từ Word, Docs hoặc PDF không lo mất dấu đầu dòng.
            </p>
          </div>
        </section>

        {/* ── SECTION 2: STATISTICS METRICS ── */}
        <section className="py-10 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            {stats.map((stat, i) => (
              <div key={i} className="p-4 bg-white/30 dark:bg-slate-900/20 rounded-2xl border border-slate-200/20 select-none">
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  <AnimatedCounter end={stat.end} decimals={stat.decimals} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: COMPARISON (BEFORE vs AFTER) ── */}
        <section id="comparison" className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="text-center mb-12 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">So Sánh Thực Tế</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Xem cách Clean Text chuẩn hóa dữ liệu sao chép bị lỗi từ chatbot AI</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before Card */}
            <div className="clean-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                  ⚠️ Trước khi làm sạch
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-450 font-bold">Copy từ AI (Gemini/ChatGPT)</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-500 dark:text-slate-400 space-y-3 leading-relaxed">
                <p className="bg-slate-200/60 dark:bg-slate-800 px-2 py-1 rounded">Dưới đây là mã nguồn bạn yêu cầu:</p>
                <p>● **Bước 1**: Khởi tạo tiến trình bằng cách import thư viện.</p>
                <p>● **Bước 2**: Thực hiện chức năng và in kết quả.</p>
                <p className="text-[10px] text-slate-400"><i>[Chứa các thẻ rác, phông nền xám và bullet lỗi]</i></p>
              </div>
            </div>

            {/* After Card */}
            <div className="clean-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  ✅ Sau khi làm sạch
                </span>
                <span className="text-[10px] text-indigo-500 font-bold">Tương thích 100% MS Word</span>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 font-sans text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed border border-slate-105 dark:border-slate-800">
                <p>Dưới đây là mã nguồn bạn yêu cầu:</p>
                <p>• <b>Bước 1</b>: Khởi tạo tiến trình bằng cách import thư viện.</p>
                <p>• <b>Bước 2</b>: Thực hiện chức năng và in kết quả.</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCheck size={12} /> Nền sạch • Bullet chuẩn • Sẵn sàng sử dụng
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FEATURES GRID ── */}
        <section id="features" className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="text-center mb-12 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Tính Năng Nổi Bật</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Trải nghiệm bộ công cụ hỗ trợ văn bản toàn diện và hiện đại</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="clean-card p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Bảo Toàn Rich Text</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Giữ lại định dạng in đậm, in nghiêng, và màu sắc quan trọng của nội dung mà không giữ lại màu phông nền gây nhiễu.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="clean-card p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Khử Dấu Bullet Lỗi</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Tự động sửa lỗi bullet lỗi thời dạng các ký tự lạ, chuẩn hóa thành bullet Word giúp dán vào văn bản không bị thụt lề sai.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="clean-card p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Code size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Xóa Liên Kết Ẩn</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Loại bỏ các liên kết URL ẩn trong văn bản thô nhưng vẫn giữ nguyên nhãn chữ giúp văn bản sạch sẽ và mạch lạc hơn.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="clean-card p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Trợ Lý AI Chatbot RAG</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Đọc, phân tích và trả lời câu hỏi trực tiếp dựa trên nội dung bạn vừa làm sạch nhờ tích hợp Pinecone Vector DB và Gemini AI.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="clean-card p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Tiến Trình SSE Thời Gian Thực</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Công việc xử lý tác vụ nền sử dụng hàng đợi BullMQ + Redis, hiển thị tiến độ thời gian thực thông qua Server-Sent Events cực mượt.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="clean-card p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Award size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">Lưu Lịch Sử Bảo Mật</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Đăng nhập tài khoản nhanh gọn giúp tự động đồng bộ và lưu trữ lịch sử xử lý tài liệu để tái sử dụng mọi lúc.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: PRICING PLANS ── */}
        <section id="pricing" className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="text-center mb-12 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Bảng Giá Dịch Vụ</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Lựa chọn gói dịch vụ phù hợp với nhu cầu soạn thảo của bạn</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="clean-card p-8 flex flex-col gap-6 relative">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Cá Nhân (Starter)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Phù hợp nhu cầu cơ bản</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">0đ</span>
                  <span className="text-xs text-slate-500 ml-1">/ vĩnh viễn</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Làm sạch rich text không giới hạn
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Tải xuống tệp Word (.doc) nhanh
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Lưu lịch sử tạm thời (7 ngày)
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  5 lượt đặt câu hỏi trợ lý AI / ngày
                </li>
              </ul>

              <a 
                href="#workspace" 
                className="mt-auto block text-center py-2.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                Trải nghiệm ngay
              </a>
            </div>

            {/* Pro Tier */}
            <div className="clean-card p-8 flex flex-col gap-6 border-indigo-300 dark:border-indigo-500/50 shadow-md relative">
              <div className="absolute top-4 right-4 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-900">
                Phổ biến nhất
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">Chuyên Nghiệp (Pro)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dành cho copywriter và nhà nghiên cứu</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">99k</span>
                  <span className="text-xs text-slate-500 ml-1">/ tháng</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Toàn bộ tính năng của gói Cá Nhân
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Lưu lịch sử vĩnh viễn trên database
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Hỏi đáp Trợ lý AI không giới hạn lượt
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  Xử lý văn bản dung lượng cực lớn & ưu tiên hàng đợi
                </li>
              </ul>

              <button 
                onClick={() => showToast('Tính năng đăng ký Pro đang được tích hợp!', 'info')}
                className="mt-auto block w-full py-2.5 rounded-full text-xs font-bold btn-gradient text-center cursor-pointer"
              >
                Nâng cấp tài khoản
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: INTERACTIVE CHAT PREVIEW ── */}
        <section id="ai-preview" className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="text-center mb-12 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Hỏi Trợ Lý AI Về Tài Liệu</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Không cần đọc hết tài liệu dài, hãy hỏi trợ lý của chúng tôi</p>
          </div>

          <div className="max-w-2xl mx-auto clean-card p-6 flex flex-col gap-4">
            {/* Mock Chat Interface */}
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Assistant Preview</p>
                <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold"><span className="pulse-dot" /> Sẵn sàng phân tích</p>
              </div>
            </div>

            <div className="space-y-4 py-2">
              {/* Message User */}
              <div className="flex gap-2 justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[85%] text-xs shadow-sm">
                  Tóm tắt hộ tôi 3 điều khoản chính trong văn bản vừa rồi.
                </div>
              </div>

              {/* Message Bot */}
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  <Sparkles size={12} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[85%] text-xs shadow-sm leading-relaxed">
                  Dựa vào nội dung đã trích xuất, đây là 3 điều khoản chính:<br />
                  1. <b>Thời hạn:</b> Hợp đồng có hiệu lực 12 tháng từ ngày ký.<br />
                  2. <b>Bảo mật:</b> Không tiết lộ mã nguồn dự án cho bên ngoài.<br />
                  3. <b>Thanh toán:</b> Quyết toán định kỳ vào ngày 5 hàng tháng.
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-3.5 mt-2 flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Trải nghiệm thật bằng cách click vào nút Sparkles 🌟 nổi ở góc phải.</span>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="btn-gradient px-4 py-2 rounded-full font-bold shrink-0 cursor-pointer flex items-center gap-1 text-[11px]"
              >
                <span>Hỏi thử AI</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: TESTIMONIALS ── */}
        <section className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="text-center mb-12 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Đánh Giá Từ Người Dùng</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Những chia sẻ thực tế từ trải nghiệm sử dụng Clean Text Workspace</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <div key={idx} className="clean-card p-6 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 text-amber-550 dark:text-amber-400">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 8: FAQ ACCORDION ── */}
        <section id="faq" className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="text-center mb-12 select-none">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Câu Hỏi Thường Gặp</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Giải đáp các thắc mắc phổ biến của người dùng về hệ thống</p>
          </div>

          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="clean-card overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className={`text-indigo-500 shrink-0 transform transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 9: AUTHOR & CONTACT FEEDBACK ── */}
        <section id="author" className="py-12 md:py-20 border-t border-slate-200/50 dark:border-slate-800/30 scroll-mt-16 fade-in-on-scroll">
          <div className="grid md:grid-cols-12 gap-8 max-w-5xl mx-auto">
            
            {/* Bio Card */}
            <div className="md:col-span-5 clean-card p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3.5 select-none">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Award size={28} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-200">Đoàn Tuệ Định</h3>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Fresher .NET Developer</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Đam mê phát triển kiến trúc backend chuyên nghiệp và thiết kế UI/UX tinh gọn, mượt mà. Luôn cố gắng tối ưu hóa trải nghiệm người dùng trong từng sản phẩm.
              </p>

              <div className="flex items-center gap-3 mt-1">
                <a href="https://github.com/DinhCNTT" target="_blank" rel="noreferrer" 
                   className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                     <path d="M9 18c-4.51 2-5-2-7-2"/>
                   </svg>
                </a>
                <a href="https://linkedin.com/in/doantuedinh" target="_blank" rel="noreferrer" 
                   className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                     <rect width="4" height="12" x="2" y="9"/>
                     <circle cx="4" cy="4" r="2"/>
                   </svg>
                </a>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="md:col-span-7 clean-card p-6 flex flex-col gap-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2 select-none">
                <Send size={15} className="text-indigo-500" />
                Góp Ý & Báo Lỗi Trực Tiếp
              </h3>
              
              <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-3">
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  placeholder="Ý kiến đóng góp của bạn về công cụ làm sạch văn bản này..."
                  required
                  rows={3}
                  className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-indigo-400 focus:outline-none rounded-2xl text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-colors"
                />
                
                <div className="flex justify-end select-none">
                  <button
                    type="submit"
                    disabled={!feedbackMsg.trim() || feedbackStatus === 'sending'}
                    className="btn-gradient px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {feedbackStatus === 'sending' ? 'Đang gửi...' : 'Gửi góp ý'}
                    <Send size={12} />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </section>

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
        currentUser={currentUser}
        onSelect={(html) => { 
          setOutputHtml(html); 
          setIsHistoryDrawerOpen(false); 
          showToast('Đã tải lịch sử', 'success'); 
        }} 
      />

      <ChatDrawer 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        currentUser={currentUser}
      />

      {/* ── FLOATING AI CHAT BUTTON ── */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-200 group border border-white/10 cursor-pointer"
        title="Hỏi AI về tài liệu"
      >
        <Sparkles className="group-hover:rotate-12 transition-transform duration-200" size={16} />
      </button>

      <Toast toast={toast} />
      
      <FloatingNav scrollPosition={scrollPosition} actionBarRef={actionBarRef} />
    </div>
  );
}

export default App;
