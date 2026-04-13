import React, { useEffect, useState, useCallback } from 'react';
import { HelpCircle, Sparkles, Brain, Code2, Zap } from 'lucide-react';

const ICONS = [HelpCircle, Sparkles, Brain, Code2, Zap];

const CursorInteraction = () => {
  const [particles, setParticles] = useState([]);

  const addParticle = useCallback((e) => {
    // Throttle particle creation
    if (Math.random() > 0.15) return; 

    const Icon = ICONS[Math.floor(Math.random() * ICONS.length)];
    const id = Date.now() + Math.random();
    
    const newParticle = {
      id,
      x: e.clientX,
      y: e.clientY,
      Icon,
      rotation: Math.random() * 360,
      scale: Math.random() * 0.5 + 0.5
    };

    setParticles(prev => [...prev, newParticle].slice(-20)); // Keep max 20 particles for performance

    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 1500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', addParticle);
    return () => window.removeEventListener('mousemove', addParticle);
  }, [addParticle]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute text-white/30 animate-cursor-float"
          style={{
            left: p.x,
            top: p.y,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${p.scale})`,
          }}
        >
          <p.Icon size={32} />
        </div>
      ))}
    </div>
  );
};

const InteractiveBackground = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans text-slate-100 flex flex-col relative selection:bg-indigo-500/30">
      
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
         <div className="absolute inset-0 bg-slate-900"></div>
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-purple-900/40"></div>
         
         {/* Floating Blobs */}
         <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/30 blur-[120px] mix-blend-screen animate-blob animation-delay-2000 pointer-events-none"></div>
         <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/20 blur-[150px] mix-blend-screen animate-blob animation-delay-4000 pointer-events-none"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#9333EA]/20 blur-[160px] mix-blend-screen animate-blob pointer-events-none"></div>
         
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>
      </div>

      <CursorInteraction />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default InteractiveBackground;
