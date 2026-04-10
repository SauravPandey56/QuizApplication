import React, { useState } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you regarding QuizSphere?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    const historyPayload = messages; // current message history

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: userMessage,
        history: historyPayload
      });
      setMessages(prev => [...prev, { text: response.data.text, sender: 'bot' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { text: "Sorry, I am facing connectivity issues at the moment.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center group"
          title="Ask for help!"
        >
          <MessageCircle size={28} />
          <span className="absolute right-full mr-3 whitespace-nowrap bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Ask me anything
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-fade-in" style={{ height: '400px' }}>
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center"><MessageCircle size={20} className="mr-2"/> QuizSphere Bot</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20}/></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${m.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 shadow-sm text-slate-700 rounded-bl-none'}`}>
                   {m.text}
                 </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="p-3 bg-white border border-slate-200 shadow-sm text-slate-400 rounded-2xl rounded-bl-none text-xs flex items-center space-x-1">
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
                 </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center">
             <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 text-sm border rounded-l-lg outline-none focus:border-indigo-500 bg-slate-50" />
             <button type="submit" className="bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 transition-colors"><Send size={18}/></button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
