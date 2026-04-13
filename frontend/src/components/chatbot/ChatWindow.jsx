import React, { useRef, useEffect, useState } from 'react';
import { X, Send, Trash2, HelpCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { getBotResponse } from './chatbotLogic';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('quizsphere_chat');
    if (saved) return JSON.parse(saved);
    return [{ text: "Hello 👋 Welcome to the Quiz Assistant. How can I help you today?", sender: 'bot', timestamp: Date.now() }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('quizsphere_chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMsg = { text: text.trim(), sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate network delay and thinking
    const delay = Math.floor(Math.random() * 500) + 700; // 700-1200ms
    setTimeout(() => {
      const response = getBotResponse(text.trim());
      setMessages(prev => [...prev, { text: response, sender: 'bot', timestamp: Date.now() }]);
      setIsTyping(false);
    }, delay);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear chat history?')) {
      const resetMsg = [{ text: "Chat cleared. How can I help you?", sender: 'bot', timestamp: Date.now() }];
      setMessages(resetMsg);
      localStorage.setItem('quizsphere_chat', JSON.stringify(resetMsg));
    }
  };

  const quickSuggestions = ["Start Quiz", "Login Help", "View Results", "Contact Admin"];

  return (
    <div className="fixed bottom-6 right-6 w-[350px] bg-white rounded-[24px] shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-fade-in" style={{ height: '550px' }}>
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 text-xl">
              🤖
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide">Quiz Assistant</h3>
            <p className="text-[11px] text-indigo-100 font-medium">Online • Responds instantly</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button onClick={clearChat} className="p-2 hover:bg-indigo-500 rounded-xl transition-colors text-indigo-100 hover:text-white" title="Clear Chat">
             <Trash2 size={16}/>
          </button>
          <button onClick={onClose} className="p-2 hover:bg-indigo-500 rounded-xl transition-colors text-indigo-100 hover:text-white">
             <X size={20}/>
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F9FAFB] relative scroll-smooth flex flex-col">
        {messages.map((m, i) => <MessageBubble key={i} message={m} />)}
        
        {isTyping && (
           <div className="flex justify-start mb-3 animate-fade-in">
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0 shadow-sm border border-indigo-50">🤖</div>
             <div className="px-4 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm flex items-center space-x-1.5 h-10 w-16">
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
               <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {!isTyping && (
        <div className="px-3 pb-2 pt-2 bg-[#F9FAFB] flex space-x-2 overflow-x-auto hide-scrollbar whitespace-nowrap border-t border-slate-100">
          {quickSuggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(s)}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors shadow-sm shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="p-3 bg-white border-t border-slate-100 flex items-center shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
         <input 
           type="text" 
           value={input} 
           onChange={e => setInput(e.target.value)} 
           placeholder="Ask me anything..." 
           className="flex-1 px-4 py-3.5 text-sm bg-slate-50 border border-slate-200 object-cover rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium" 
         />
         <button 
           type="submit" 
           disabled={!input.trim()}
           className="ml-2 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:active:scale-100"
         >
           <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
         </button>
      </form>
    </div>
  );
};

export default ChatWindow;
