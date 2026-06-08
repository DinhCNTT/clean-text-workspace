import React from 'react';
import { Scale, UserCheck, Shield, AlertCircle, Globe, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="w-full px-4 md:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-sm">
            <ChevronLeft size={18} />
            Trở về màn hình chính
          </Link>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-fade-in">
        <div className="text-center mb-16">
          <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
            <Scale size={32} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Điều Khoản Dịch Vụ</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Cập nhật lần cuối: 08/06/2026
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
            <p className="text-[15px] text-indigo-900 dark:text-indigo-300 font-medium leading-relaxed">
              Chào mừng bạn đến với <strong className="font-bold text-indigo-600 dark:text-indigo-400">Clean Text Workspace</strong>. 
              Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng dịch vụ. Bằng việc truy cập và sử dụng ứng dụng, bạn đồng ý chịu sự ràng buộc pháp lý bởi các điều khoản này.
            </p>
          </div>

          <div className="space-y-8 md:space-y-10">
            <section className="flex flex-col md:flex-row gap-4 md:gap-6 group">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/20 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                <Scale size={24} />
              </div>
              <div className="flex-1 mt-1">
                <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">1. Mục đích & Phạm vi sử dụng</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Clean Text cung cấp tiện ích tự động hóa làm sạch định dạng văn bản. Bạn được cấp quyền sử dụng miễn phí cho mục đích cá nhân và công việc thường ngày. Bạn cam kết <strong>không sử dụng</strong> công cụ này để phát tán mã độc, spam, hoặc xử lý các văn bản vi phạm pháp luật hiện hành.
                </p>
              </div>
            </section>

            <section className="flex flex-col md:flex-row gap-4 md:gap-6 group">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/20 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                <UserCheck size={24} />
              </div>
              <div className="flex-1 mt-1">
                <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">2. Tài khoản & Trách nhiệm dữ liệu</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Đối với tính năng "Lưu lịch sử", bạn cần khởi tạo tài khoản và chịu trách nhiệm bảo mật thông tin xác thực của mình. Hệ thống áp dụng mã hóa để bảo vệ dữ liệu, tuy nhiên, bạn đồng ý rằng chúng tôi không chịu trách nhiệm cho các rủi ro rò rỉ dữ liệu phát sinh từ phía thiết bị của người dùng (ví dụ: máy tính nhiễm virus, lộ mật khẩu).
                </p>
              </div>
            </section>

            <section className="flex flex-col md:flex-row gap-4 md:gap-6 group">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/20 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                <Shield size={24} />
              </div>
              <div className="flex-1 mt-1">
                <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">3. Bản quyền & Sở hữu trí tuệ</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Giao diện, thiết kế, mã nguồn và thuật toán xử lý thuộc bản quyền độc quyền của Clean Text. Việc sao chép, dịch ngược (reverse engineering) để trục lợi là vi phạm nghiêm trọng luật sở hữu trí tuệ. Ngược lại, bản quyền đối với các nội dung văn bản mà bạn xử lý thông qua công cụ này hoàn toàn thuộc về cá nhân/tổ chức của bạn.
                </p>
              </div>
            </section>

            <section className="flex flex-col md:flex-row gap-4 md:gap-6 group">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/20 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                <AlertCircle size={24} />
              </div>
              <div className="flex-1 mt-1">
                <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">4. Giới hạn trách nhiệm</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Công cụ được cung cấp theo nguyên trạng ("As is") và không đi kèm bất kỳ bảo đảm ngầm định nào về độ hoàn hảo tuyệt đối. Mặc dù hệ thống luôn được tối ưu để duy trì độ ổn định cao nhất, chúng tôi được miễn trừ trách nhiệm pháp lý cho các tổn thất gián tiếp, dữ liệu bị sai lệch, hoặc gián đoạn công việc do sự cố kỹ thuật bất khả kháng.
                </p>
              </div>
            </section>

            <section className="flex flex-col md:flex-row gap-4 md:gap-6 group">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/20 dark:group-hover:border-indigo-500/30 transition-all duration-300">
                <Globe size={24} />
              </div>
              <div className="flex-1 mt-1">
                <h2 className="text-[18px] font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">5. Cập nhật & Chấm dứt dịch vụ</h2>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ban quản trị bảo lưu quyền sửa đổi các điều khoản này, cũng như quyền cập nhật, giới hạn hoặc tạm ngưng cung cấp một phần/toàn bộ dịch vụ bất cứ lúc nào để bảo trì hệ thống. Các thay đổi quan trọng liên quan đến dữ liệu người dùng sẽ luôn được thông báo công khai trên giao diện chính.
                </p>
              </div>
            </section>
          </div>
          
          <div className="pt-10 mt-10 border-t border-slate-200 dark:border-slate-800/60 flex flex-col items-center justify-center gap-2">
            <p className="text-[14px] text-slate-500 dark:text-slate-400 text-center">
              Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ trực tiếp:
            </p>
            <a href="mailto:dinhcm123321@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              dinhcm123321@gmail.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
