import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Mail, ChevronRight, Send, MessageSquare, ExternalLink, Activity } from 'lucide-react';
import QuizSphereLogo from '../logo/QuizSphereLogo';

const testimonials = [
  { text: "Scaling examinations across 5,000+ candidates seamlessly. This cryptographic architecture is unmatched.", author: "Dr. A. Verma", role: "Head Examiner, CSE" },
  { text: "Zero downtime during the midterms. The real-time mapping engine operates flawlessly under load.", author: "S. K. Mishra", role: "Systems Architect" },
  { text: "Vercel-level aesthetics merged with robust EdTech logic. Our students absolutely love the new UI interfaces.", author: "P. Singh", role: "Frontend Lead" },
  { text: "The feedback loops and dashboard telemetry give us instant insights into candidate trajectory.", author: "M. Patel", role: "Analytics Director" }
];

const Footer = ({ className = '' }) => {
  const { user } = useContext(AuthContext) || {};
  
  const [feedback, setFeedback] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    message: '' 
  });
  const [feedbackStatus, setFeedbackStatus] = useState('');

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/feedbacks', feedback);
      setFeedbackStatus('System Feedback Transmitted.');
      setFeedback({ name: user?.name || '', email: user?.email || '', message: '' });
      setTimeout(() => setFeedbackStatus(''), 4000);
    } catch {
      setFeedbackStatus('Transmission Failed.');
    }
  };

  return (
    <footer className={`bg-[#050505] border-t border-white/5 relative overflow-hidden ${className}`}>
      
      {/* Ambient Floor Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] left-1/4 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Infinite Testimonial Scroller Pipeline */}
      <div className="w-full border-b border-indigo-500/10 bg-gradient-to-r from-transparent via-[#0f0f12] to-transparent py-4 relative z-10 overflow-hidden">
        <div className="flex w-[200%] animate-scroll hover:[animation-play-state:paused] items-center space-x-12 px-6">
          {/* Double array to create seamless loop effect */}
          {[...testimonials, ...testimonials].map((t, i) => (
             <div key={i} className="flex-shrink-0 w-[400px] bg-[#111113]/80 backdrop-blur-md rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-[140px] group transition-colors hover:border-indigo-500/30">
                <p className="text-slate-300 font-medium text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-[10px] font-black text-white shadow-md">
                     {t.author.charAt(0)}{t.author.charAt(4)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{t.author}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{t.role}</p>
                  </div>
                </div>
             </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12 relative z-10">
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Brand Block */}
            <div className="lg:col-span-4 space-y-6">
               <QuizSphereLogo size="md" layout="horizontal" />
               <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                 Architected for scalable exam execution. We deliver cryptographically secured testing matrices directly to targeted academic environments.
               </p>
               
               {/* Connectors Block */}
               <div className="pt-2">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center"><Activity size={12} className="mr-2 text-indigo-400"/> Operational Connectors</p>
                 <div className="flex items-center space-x-3">
                   <a href="https://github.com/SauravPandey56" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1A1A1E] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 group">
                     <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   </a>
                   <a href="https://www.linkedin.com/in/sauravpandey56" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1A1A1E] border border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 hover:border-blue-500/30 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 group">
                     <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                   </a>
                 </div>
               </div>
            </div>

            {/* Platform Metrics */}
            <div className="lg:col-span-2 lg:col-start-6">
               <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Matrix Nodes</h3>
               <ul className="space-y-4 text-sm text-slate-400 font-medium">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><ChevronRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-1 text-indigo-500"/> Core Engine</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><ChevronRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-1 text-indigo-500"/> Global Leaderboard</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><ChevronRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all mr-1 text-indigo-500"/> Documentation <ExternalLink size={10} className="ml-2"/></a></li>
               </ul>
            </div>

            <div className="lg:col-span-2">
               <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Protocols</h3>
               <ul className="space-y-4 text-sm text-slate-400 font-medium">
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Security Metrics</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Standard</a></li>
                  <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Compute</a></li>
               </ul>
            </div>

            {/* Quick Transmitter */}
            <div className="lg:col-span-4 pl-0 lg:pl-8 lg:border-l border-white/5">
               <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center">
                 <MessageSquare size={14} className="mr-2 text-indigo-400"/> Micro Transmitter
               </h3>
               <form onSubmit={submitFeedback} className="space-y-3 relative group">
                 <p className="text-xs text-slate-500 mb-4 font-medium">Send rapid diagnostics directly to engineering infrastructure without leaving the console.</p>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600">
                     <Mail size={14} />
                   </div>
                   <input 
                     type="email" 
                     placeholder="Return Vector (Email)"
                     value={feedback.email} 
                     onChange={e => setFeedback({...feedback, email: e.target.value})}
                     className="w-full pl-10 pr-4 py-3 bg-[#111113] border border-white/10 focus:border-indigo-500 rounded-xl text-sm font-medium outline-none text-slate-200 transition-all" 
                     required 
                     readOnly={!!user}
                   />
                 </div>
                 <div className="relative">
                   <textarea 
                     value={feedback.message} 
                     onChange={e => setFeedback({...feedback, message: e.target.value})} 
                     className="w-full pl-4 pr-12 py-3 bg-[#111113] border border-white/10 focus:border-indigo-500 rounded-xl text-sm font-medium outline-none text-slate-200 transition-all resize-none" 
                     rows="3" 
                     placeholder="Inject payload sequence..." 
                     required
                   ></textarea>
                   <button type="submit" className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-transform transform active:scale-95 shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                     <Send size={16} />
                   </button>
                 </div>
                 {feedbackStatus && <span className="absolute -bottom-6 left-0 text-xs font-black uppercase tracking-widest text-[#06B6D4] animate-fade-in flex items-center"><Activity size={10} className="mr-1"/> {feedbackStatus}</span>}
               </form>
            </div>

         </div>

         <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-600 uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Saurav Pandey. QuizSphere.</p>
            <p className="mt-4 md:mt-0 flex items-center text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
              All nodes online
            </p>
         </div>
      </div>
    </footer>
  );
};

export default Footer;
