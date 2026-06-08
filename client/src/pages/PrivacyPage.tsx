import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronLeft, Lock, Zap, Database, CheckCircle2, UserX, ServerOff } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  // Cuộn lên đầu trang khi vừa vào
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-mesh font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 md:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-semibold text-sm">
            <ChevronLeft size={18} />
            Trở về màn hình chính
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
        
        {/* ── HERO SECTION ── */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-20 dark:opacity-10">
            <Shield size={300} className="text-emerald-500 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 mb-6 shadow-xl shadow-emerald-500/10">
              <Shield size={40} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 mb-6 tracking-tight">Chính Sách Bảo Mật</h1>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Tại Clean Text Workspace, sự riêng tư của bạn không chỉ là lời hứa — nó là nguyên tắc cốt lõi được lập trình sâu vào kiến trúc hệ thống của chúng tôi.
            </p>
          </div>
        </div>

        {/* ── CORE PILLARS ── */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap size={28} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Xử Lý Offline 100%</h3>
            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
              Mọi thao tác "Làm sạch văn bản" đều được thực thi trực tiếp trên RAM máy tính hoặc điện thoại của bạn (Client-side). Không có bất kỳ dữ liệu nháp nào được bí mật gửi về máy chủ của chúng tôi khi bạn đang gõ.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database size={28} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Lưu Trữ Đám Mây An Toàn</h3>
            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
              Dữ liệu chỉ được đồng bộ lên Cloud (MongoDB) khi bạn chủ động bấm nút "Lưu vào lịch sử". Tại đây, văn bản của bạn được gắn thẻ với JWT Token độc quyền, cô lập hoàn toàn với người dùng khác.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-pink-300 dark:hover:border-pink-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ServerOff size={28} className="text-pink-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Không Bán Dữ Liệu</h3>
            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
              Chúng tôi cam kết không thu thập dữ liệu cá nhân để chạy quảng cáo hay cung cấp cho bên thứ ba. Mô hình kinh doanh của Clean Text Workspace không dựa trên việc thương mại hóa nội dung của người dùng.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserX size={28} className="text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">Toàn Quyền Xóa Bỏ</h3>
            <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
              Bạn có quyền xóa bất kỳ lịch sử nào hoặc yêu cầu xóa toàn bộ tài khoản. Khi bạn nhấn "Xóa", dữ liệu sẽ bị gỡ bỏ vĩnh viễn khỏi Database của chúng tôi mà không thể phục hồi.
            </p>
          </div>
        </div>

        {/* ── DETAILED POLICY ── */}
        <div className="space-y-8 p-8 md:p-12 rounded-3xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-500/10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-3">
            <Lock size={24} className="text-emerald-500" />
            Chi tiết Thu thập & Sử dụng
          </h2>
          
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-200 mb-1">Cookie & Local Storage</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                  Chúng tôi chỉ sử dụng Local Storage để lưu tùy chọn của bạn (như Dark Mode, tính năng giữ lại thẻ Links) và lưu nháp tạm thời nội dung bạn đang làm dở, giúp tránh mất dữ liệu khi rớt mạng. Các lưu trữ này hoàn toàn nằm trên máy của bạn.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-200 mb-1">Tài khoản & Xác thực an toàn</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                  Khi bạn tạo tài khoản, hệ thống chỉ lưu trữ tên hiển thị và email. Mật khẩu của bạn được băm (hashing) và mã hóa một chiều nghiêm ngặt trước khi lưu vào cơ sở dữ liệu. Ngay cả đội ngũ quản trị cũng tuyệt đối không thể đọc được mật khẩu gốc của bạn.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-800 dark:text-slate-200 mb-1">Dữ liệu phân tích lỗi (Error Tracking)</strong>
                <p className="text-slate-600 dark:text-slate-400 text-[15px] leading-relaxed">
                  Đôi khi hệ thống có thể thu thập các log lỗi vô danh (anonymous logs) để giúp kỹ sư phát hiện và khắc phục các vấn đề liên quan đến tương thích trình duyệt. Các log này không bao giờ đính kèm nội dung văn bản của bạn.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* ── FOOTER CONTACT ── */}
        <div className="mt-16 text-center border-t border-slate-200 dark:border-slate-800 pt-10">
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-[15px]">
            Chính sách này có hiệu lực từ ngày 08/06/2026. Nếu bạn có câu hỏi về quyền riêng tư, vui lòng liên hệ Data Protection Officer (DPO):
          </p>
          <a href="mailto:dinhcm123321@gmail.com" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-slate-900 dark:bg-emerald-600 text-white font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            dinhcm123321@gmail.com
          </a>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
