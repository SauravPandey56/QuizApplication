import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import { Brain, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (user) {
    return <Navigate to="/" />; // Redirects to Dashboard inside App.jsx routing
  }

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden font-sans text-slate-100 flex flex-col relative selection:bg-indigo-500/30">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse pointer-events-none"></div>
        <div className="absolute top-[40%] -right-[10%] w-[35%] h-[35%] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none sticky animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-50 w-full px-6 py-6 max-w-7xl mx-auto flex justify-between items-center backdrop-blur-sm transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="QuizSphere Logo" className="w-12 h-12 object-contain rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-500/30" />
          <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 text-transparent bg-clip-text">
            QuizSphere
          </span>
        </div>
        <div className="hidden sm:flex items-center space-x-6 font-medium text-sm">
           <Link to="/login" className="text-slate-300 hover:text-white transition-colors font-semibold">Sign In</Link>
           <Link to="/register" className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:-translate-y-0.5 font-bold">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-16 pb-24 text-center">
         
         <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 uppercase tracking-wider backdrop-blur-md transition-all duration-1000 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
            </span>
            <span>Next-Generation Evaluation</span>
         </div>

         <h1 className={`text-5xl md:text-7xl font-black max-w-5xl leading-[1.1] mb-6 drop-shadow-lg transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Empower Learning with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 animate-gradient-x">
               Intelligent Quizzes
            </span>
         </h1>

         <p className={`text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           A robust SaaS platform for educational institutions. Conduct deeply verified, proctored examinations instantly with precise tracking and real-time AI assistance.
         </p>

         <div className={`flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
           <Link to="/register" className="group flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] focus:ring-4 focus:ring-white/50 border border-transparent">
             <span>Start for Free</span>
             <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
           </Link>
           <Link to="/login" className="flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-medium text-lg hover:bg-slate-700 hover:border-slate-500 transition-all hover:shadow-lg focus:ring-4 focus:ring-slate-700">
             Log Into Account
           </Link>
         </div>

         {/* Features grid */}
         <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full text-left transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
            <FeatureCard 
               icon={<ShieldCheck size={32} className="text-cyan-400" />}
               title="Secure Proctoring"
               description="Real-time environment locking, fullscreen validation, and anti-cheat tracking mechanics."
            />
            <FeatureCard 
               icon={<Brain size={32} className="text-purple-400" />}
               title="AI Assistance"
               description="Global AI Chatbot powered by Google Gemini ensuring instant 24/7 academic support."
            />
            <FeatureCard 
               icon={<Activity size={32} className="text-indigo-400" />}
               title="Live Analytics"
               description="Extensive real-time monitoring, immediate score calculations, and granular reporting."
            />
         </div>
      </main>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/80 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 group">
    <div className="bg-slate-900/60 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300">
       {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium">{description}</p>
  </div>
);

export default Landing;
