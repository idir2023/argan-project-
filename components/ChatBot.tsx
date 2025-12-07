import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { createBeautyAdvisorChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'مرحباً بك في أرغانيا 🌿 أنا مساعدتك الذكية للجمال. كيف يمكنني مساعدتك اليوم في اختيار منتجات الأرغان المناسبة لك؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSession) {
      const chat = createBeautyAdvisorChat();
      if (chat) {
        setChatSession(chat);
      } else {
         // Fallback if no API Key is present in real env, usually we just don't init
         // But for demo purposes we keep it quiet or show error in console
         console.warn("API Key missing for Gemini");
      }
    }
  }, [isOpen, chatSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of result) {
        const text = chunk.text; // Access .text directly property
        if(text) {
            fullText += text;
            setMessages(prev => {
                const newArr = [...prev];
                newArr[newArr.length - 1].text = fullText;
                return newArr;
            });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً، حدث خطأ تقني. يرجى المحاولة لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-gold-600 text-white p-4 rounded-full shadow-xl hover:bg-gold-700 transition-all duration-300 hover:scale-110 flex items-center gap-2 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <Sparkles size={24} />
        <span className="font-bold hidden md:inline">مستشارة الجمال</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gold-100 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-soil-900 to-soil-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-gold-500/20 p-2 rounded-full">
                <Sparkles size={20} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-bold">مستشارة أرغانيا</h3>
                <p className="text-xs text-gold-200">مدعوم بالذكاء الاصطناعي</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-soil-50">
             {/* If no API key is set, show warning (only for dev/demo awareness) */}
             {!chatSession && (
                <div className="text-center text-red-500 text-sm p-2 bg-red-50 rounded">
                    الرجاء إعداد مفتاح API الخاص بـ Gemini.
                </div>
             )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-gold-600 text-white rounded-tl-none' 
                      : 'bg-white text-soil-900 shadow-sm border border-gray-100 rounded-tr-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="اكتبي سؤالك هنا..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 text-right"
              dir="rtl"
              disabled={!chatSession}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || !chatSession}
              className="bg-gold-600 text-white p-2 rounded-full hover:bg-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rtl:rotate-180" />}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
