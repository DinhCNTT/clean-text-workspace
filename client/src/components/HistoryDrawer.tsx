import React, { useState, useEffect } from 'react';
import { X, Trash2, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';

interface HistoryItem {
  _id: string;
  title: string;
  contentHtml: string;
  wordCount: number;
  createdAt: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (html: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, onSelect }) => {
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchHistories = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Không thể tải lịch sử');
      const data = await res.json();
      setHistories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistories();
      setDeleteConfirmId(null);
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Ngăn sự kiện click vào item
    
    const token = localStorage.getItem('token');
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/history/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Không thể xóa');
      
      // Xóa thành công, cập nhật state
      setHistories(prev => prev.filter(h => h._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Đã xảy ra lỗi khi xóa!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
            <Clock size={24} />
            Lịch sử đã lưu
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-indigo-500">
              <Loader2 className="animate-spin mb-2" size={32} />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Đang tải lịch sử...</p>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 p-4 text-red-600 bg-red-50 dark:bg-red-500/10 rounded-xl">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : histories.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full gap-4">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <FileText size={32} className="text-slate-400" />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Chưa có lịch sử nào</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">Các văn bản bạn "Lưu vào lịch sử" sẽ xuất hiện ở đây để xem lại bất cứ lúc nào.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {histories.map((history) => (
                <div 
                  key={history._id}
                  onClick={() => {
                    if (deleteConfirmId === history._id) return;
                    onSelect(history.contentHtml);
                    onClose();
                  }}
                  className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200 relative overflow-hidden"
                >
                  {deleteConfirmId === history._id ? (
                    <div className="absolute inset-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center animate-fade-in px-4">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Chắc chắn xóa bản ghi này?</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }} 
                          className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          Hủy
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, history._id)} 
                          className="px-4 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5"
                        >
                          Xóa luôn
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="pr-8">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-base mb-1.5 truncate">
                      {history.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(history.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(history._id); }}
                    className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Xóa lịch sử này"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
