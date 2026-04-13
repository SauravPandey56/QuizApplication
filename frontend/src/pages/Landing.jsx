import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import InteractiveBackground from '../components/layout/InteractiveBackground';
import { 
  Brain, ShieldCheck, ArrowRight, Activity, 
  CheckCircle2, Users, Trophy, ChevronRight, PlayCircle, Star
} from 'lucide-react';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (user) {
    return <Navigate to="/" />;
  }

  const mockLeaderboard = [
    { rank: 1, name: "Alex Chen", score: "9,850", campus: "Seattle Main" },
    { rank: 2, name: "Sarah Jenkins", score: "9,720", campus: "Online Remote" },
    { rank: 3, name: "Michael Ross", score: "9,410", campus: "Boston Tech" },
    { rank: 4, name: "Emma Watson", score: "9,105", campus: "Seattle Main" },
    { rank: 5, name: "David Kim", score: "8,990", campus: "Online Remote" },
  ];

  return (
    <InteractiveBackground>
      
      {/* Navigation Layer */}
      <nav className={`relative z-50 w-full px-6 py-6 max-w-7xl mx-auto flex justify-between items-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <QuizSphereLogo size="md" layout="horizontal" />
        <div className="hidden sm:flex items-center space-x-8 font-medium">
           <Link to="/login" className="text-slate-300 hover:text-white transition-colors text-sm font-bold">Sign In</Link>
           <button onClick={() => navigate('/register')} className="px-6 py-2.5 rounded-full bg-white text-indigo-900 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] font-black text-sm flex items-center space-x-2 group">
             <span>Get Started</span>
             <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
           </button>
        </div>
      </nav>

      <main className="relative z-10 w-full flex-1">
         
         {/* 1. HERO SECTION */}
         <section className="max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col lg:flex-row items-center justify-between">
            {/* Left Side: Copy & CTAs */}
            <div className={`lg:w-1/2 text-left transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
               <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold mb-8 uppercase tracking-wider backdrop-blur-md">
                 <span className="relative flex h-2.5 w-2.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                 </span>
                 <span>Enterprise Edition v2.0 Live</span>
               </div>
               
               <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 drop-shadow-lg text-white tracking-tight">
                  QuizSphere <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-[#6366F1] to-purple-400 animate-gradient-x">
                     Smart Quiz Platform
                  </span>
               </h1>

               <p className="text-xl text-slate-400 max-w-lg mb-8 leading-relaxed font-medium">
                 Test your knowledge, track precise performance metrics, and compete with top algorithms globally.
               </p>

               <ul className="space-y-4 mb-10">
                 {['Real-time proctored quizzes', 'Deep performance analytics', 'Global leaderboard system'].map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-300 font-semibold">
                      <CheckCircle2 size={20} className="text-[#06B6D4] mr-3" /> {feature}
                    </li>
                 ))}
               </ul>

               <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                 <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-extrabold text-lg hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 flex justify-center items-center group">
                   Start Executing <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button className="px-8 py-4 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-semibold text-lg hover:bg-slate-700 transition-all flex justify-center items-center">
                   <PlayCircle size={20} className="mr-2" /> Explore Quizzes
                 </button>
               </div>
            </div>

            {/* Right Side: Graphic/Login Illusion */}
            <div className={`lg:w-[45%] mt-20 lg:mt-0 relative transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
               
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[3rem] blur-2xl opacity-20 animate-pulse"></div>
               
               {/* Aesthetic Editor/Testing Mockup window */}
               <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                  <div className="h-12 border-b border-white/10 flex items-center px-6 space-x-2 bg-slate-950/50">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <div className="p-8">
                     <div className="flex justify-between items-center mb-8">
                        <div>
                          <div className="w-16 h-4 bg-slate-700 rounded-full mb-2"></div>
                          <div className="w-48 h-6 bg-slate-600 rounded-full"></div>
                        </div>
                        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                     </div>
                     <div className="space-y-4">
                        <div className="w-full h-16 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center px-4"><div className="w-6 h-6 rounded-md bg-indigo-500 mr-4"></div><div className="w-32 h-3 bg-slate-600 rounded-full"></div></div>
                        <div className="w-full h-16 rounded-xl bg-indigo-500/10 border border-indigo-500/50 flex items-center px-4"><div className="w-6 h-6 rounded-md bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] mr-4"></div><div className="w-40 h-3 bg-indigo-400 rounded-full"></div></div>
                        <div className="w-full h-16 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center px-4"><div className="w-6 h-6 rounded-md bg-slate-700 mr-4"></div><div className="w-24 h-3 bg-slate-600 rounded-full"></div></div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* 6. FEATURES SECTION */}
         <section className="py-24 bg-slate-950/50 border-t border-b border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
               <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Engineered for Scale</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">Every vector of the platform is designed to provide immediate feedback loop analytics.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FeatureCard 
                     icon={<Activity size={32} className="text-indigo-400" />}
                     title="Interactive Quizzes"
                     desc="Engage with non-linear question palettes and secure full-screen lockdown."
                  />
                  <FeatureCard 
                     icon={<Trophy size={32} className="text-yellow-400" />}
                     title="Leaderboard Matrix"
                     desc="Compete natively against algorithms and classmates across the globe."
                  />
                  <FeatureCard 
                     icon={<ShieldCheck size={32} className="text-emerald-400" />}
                     title="Instant Results"
                     desc="Data computed in milliseconds post-submission via edge handlers."
                  />
                  <FeatureCard 
                     icon={<Brain size={32} className="text-cyan-400" />}
                     title="Deep Analytics"
                     desc="Recharts-powered trajectory mappings and accuracy pipeline parsing."
                  />
               </div>
            </div>
         </section>

         {/* 7. HOW IT WORKS */}
         <section className="py-32 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
               <div className="text-center mb-24">
                  <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">How it Integrates</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto text-lg">Three steps to algorithmic superiority.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                  <div className="hidden md:block absolute top-[15%] left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 z-0"></div>
                  
                  <StepCard step="1" title="Register Account" icon={<Users size={32}/>} desc="Configure your academic profile, mapped directly to institutional branches." />
                  <StepCard step="2" title="Attempt Modules" icon={<PlayCircle size={32}/>} desc="Execute securely proctored testing arrays tracking performance per second." />
                  <StepCard step="3" title="Track & Improve" icon={<TrendingUp size={32}/>} desc="View analytics, jump the global leaderboard, and review cryptographic ledgers." />
               </div>
            </div>
         </section>

         {/* 8. LEADERBOARD PREVIEW & 9. TESTIMONIAL */}
         <section className="py-24 bg-slate-950/80 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               
               {/* Left: Leaderboard Simulation */}
               <div>
                 <div className="mb-10">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Global Network</h2>
                    <p className="text-slate-400 text-lg">Push bounds against the network's highest-performing candidates.</p>
                 </div>
                 
                 <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl relative">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#9333EA] rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
                    <ul className="divide-y divide-slate-800">
                      {mockLeaderboard.map((l, i) => (
                        <li key={i} className="flex items-center justify-between py-4 transition-colors hover:bg-slate-800/30 px-4 rounded-xl">
                          <div className="flex items-center space-x-4">
                             <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center font-black text-sm ${i === 0 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : i === 1 ? 'bg-slate-300 text-slate-800' : i === 2 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                               {l.rank}
                             </div>
                             <div>
                               <p className={`font-bold ${i < 3 ? 'text-white' : 'text-slate-300'}`}>{l.name}</p>
                               <p className="text-[10px] text-slate-500 uppercase tracking-widest">{l.campus}</p>
                             </div>
                          </div>
                          <span className={`font-black ${i < 3 ? 'text-[#06B6D4]' : 'text-slate-400'}`}>{l.score}</span>
                        </li>
                      ))}
                    </ul>
                 </div>
               </div>

               {/* Right: Trust / Metrics */}
               <div className="space-y-8 pl-0 lg:pl-12">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm">
                       <h4 className="text-4xl font-black text-white mb-2">10K+</h4>
                       <p className="text-slate-400 font-medium">Quizzes Executed</p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm">
                       <h4 className="text-4xl font-black text-indigo-400 mb-2">500+</h4>
                       <p className="text-slate-400 font-medium">Active Students</p>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex space-x-1 mb-6">
                      {[1,2,3,4,5].map(i => <Star key={i} size={20} className="fill-yellow-500 text-yellow-500" />)}
                    </div>
                    <p className="text-white text-lg font-medium leading-relaxed mb-6 block italic">
                      "QuizSphere transformed how we handle internal assessments. The deep analytics and automated proctoring save us thousands of man-hours per semester."
                    </p>
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">JD</div>
                       <div>
                         <p className="text-white font-bold">Jonathan Doe</p>
                         <p className="text-slate-400 text-sm">Lead Administrator</p>
                       </div>
                    </div>
                 </div>
               </div>

            </div>
         </section>

      </main>

      {/* 10. FOOTER FIX */}
      <Footer className="relative z-10 bg-slate-950/80 border-t border-white/5" />
    </InteractiveBackground>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 group text-center md:text-left">
    <div className="bg-slate-900/60 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500 mx-auto md:mx-0">
       {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm font-medium">{desc}</p>
  </div>
);

const StepCard = ({ step, title, desc, icon }) => (
  <div className="relative flex flex-col items-center text-center group z-10">
    <div className="w-20 h-20 bg-slate-900 border-2 border-indigo-500/50 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 group-hover:border-indigo-400 relative">
      {icon}
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-black text-sm border-[3px] border-slate-900">
        {step}
      </div>
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 text-sm max-w-[250px] leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
