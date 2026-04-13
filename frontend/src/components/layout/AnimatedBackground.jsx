import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-slate-50">
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#4F46E5] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob"></div>
      <div className="absolute top-0 left-[-10%] w-1/2 h-1/2 bg-[#06B6D4] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-32 left-20 w-1/3 h-1/3 bg-[#9333EA] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 animate-blob" style={{ animationDelay: '4s' }}></div>
    </div>
  );
};

export default AnimatedBackground;
