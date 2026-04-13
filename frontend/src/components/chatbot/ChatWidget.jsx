import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatWindow from './ChatWindow';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl shadow-indigo-200 hover:scale-110 transition-all z-50 flex items-center justify-center group border-2 border-white"
          title="Ask Quiz Assistant for help!"
        >
          <MessageCircle size={28} className="drop-shadow-md" />
          <span className="absolute right-full mr-4 whitespace-nowrap bg-slate-800 text-white text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 shadow-lg pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:left-full before:border-4 before:border-transparent before:border-l-slate-800">
            Need Help?
          </span>
        </button>
      )}

      {isOpen && (
        <ChatWindow onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default ChatWidget;
