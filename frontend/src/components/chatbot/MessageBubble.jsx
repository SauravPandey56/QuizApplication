import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in mb-3`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0 shadow-sm border border-indigo-50">
          🤖
        </div>
      )}
      <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
        isUser 
          ? 'bg-indigo-600 text-white rounded-br-sm' 
          : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
      }`}>
        {message.text}
        <div className={`text-[10px] mt-1.5 text-right font-medium opacity-70 ${isUser ? 'text-indigo-100' : 'text-slate-400'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
