import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào! Tôi là AI Assistant. Bạn hãy dọn dẹp tài liệu và bắt đầu đặt câu hỏi liên quan ở đây nhé. Tôi sẽ tự động tìm kiếm thông tin tương đồng trong tài liệu đã upload của bạn.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống dòng cuối cùng khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    
    // Thêm tin nhắn user vào log
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ question: userText })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Đã có lỗi xảy ra.');
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: data.answer,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: 'bot',
        text: `⚠️ Lỗi: ${err.message || 'Không thể liên lạc với server.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
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
            <Sparkles size={24} className="animate-pulse" />
            AI Document Assistant
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400'
              }`}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                <Loader2 className="animate-spin text-pink-500" size={16} />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI đang phân tích tài liệu...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder={currentUser ? "Hỏi điều gì đó về tài liệu của bạn..." : "Đăng nhập để đặt câu hỏi cho AI..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!currentUser || loading}
              className="w-full pr-12 pl-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-2xl border border-transparent focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-[14px]"
            />
            <button
              type="submit"
              disabled={!currentUser || !input.trim() || loading}
              className={`absolute right-2 p-2 rounded-xl transition-all ${
                input.trim() && currentUser && !loading
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-transparent text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          {!currentUser && (
            <p className="text-center text-xs text-slate-500 dark:text-slate-600 mt-2 font-medium">
              💡 Bạn cần đăng nhập để AI lấy ngữ cảnh tài liệu lịch sử của bạn.
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default ChatDrawer;
