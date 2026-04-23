import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import { 
  ShieldCheck, BarChart3, Cloud, Layers, 
  Mail, Lock, Eye, EyeOff, CheckCircle2, MapPin, Send, Terminal, Globe
} from 'lucide-react';

const Landing = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState('');

  // Feedback form state
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', subject: '', message: '' });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      if (response.ok) {
        setFeedbackSuccess(true);
        setFeedbackData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error('Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF2FF] text-slate-800 font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-hidden relative flex flex-col">
      
      {/* Animated Soft Gradient Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-purple-200/50 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
        <div className="absolute top-[30%] right-[0%] w-[40%] h-[60%] bg-[#C7D2FE]/60 rounded-full blur-[140px] mix-blend-multiply opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] bg-[#E0E7FF]/80 rounded-full blur-[100px] mix-blend-multiply opacity-80"></div>
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Navigation Layer */}
      <nav className={`relative z-50 w-full px-6 py-6 max-w-7xl mx-auto flex justify-between items-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <QuizSphereLogo size="md" layout="horizontal" />
        <div className="hidden sm:flex items-center space-x-8 font-medium">
           <a href="#features" className="text-slate-600 hover:text-indigo-900 transition-colors text-sm font-semibold">Features</a>
           <a href="#security" className="text-slate-600 hover:text-indigo-900 transition-colors text-sm font-semibold">Security</a>
           <button onClick={() => navigate('/register')} className="px-5 py-2.5 rounded-full bg-slate-900 text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 font-bold text-sm">
             Create Account
           </button>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="relative z-10 w-full flex-1 flex flex-col justify-center pb-20">
         <section className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8 mt-10">
            
            {/* Left Side: Product Intro */}
            <div className={`lg:w-1/2 text-left transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
               <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/60 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6 uppercase tracking-wider backdrop-blur-md shadow-sm">
                 <span className="relative flex h-2 w-2 mr-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                 </span>
                 QuizSphere 2.0 is Live
               </div>
               
               <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.1] mb-6 text-slate-900 tracking-tight">
                  Smarter Online <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
                     Exams
                  </span>
               </h1>

               <p className="text-lg md:text-xl text-slate-600 max-w-lg mb-10 leading-relaxed font-medium">
                 Create, manage, and take secure exams with ease. QuizSphere helps institutions deliver reliable online assessments with real-time monitoring and analytics.
               </p>

               {/* Trust Indicators / Highlights */}
               <div className="grid grid-cols-2 gap-4 max-w-md">
                 <div className="flex items-center space-x-3 bg-white/40 p-3 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                     <ShieldCheck size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800 leading-tight">100% Secure</p>
                     <p className="text-[11px] font-medium text-slate-500">Infrastructure</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3 bg-white/40 p-3 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                     <Cloud size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800 leading-tight">99.9% Uptime</p>
                     <p className="text-[11px] font-medium text-slate-500">Reliability</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3 bg-white/40 p-3 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                     <BarChart3 size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800 leading-tight">Real-time</p>
                     <p className="text-[11px] font-medium text-slate-500">Analytics</p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3 bg-white/40 p-3 rounded-2xl border border-white/60 backdrop-blur-sm shadow-sm">
                   <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                     <Layers size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-800 leading-tight">Scalable</p>
                     <p className="text-[11px] font-medium text-slate-500">Testing Platform</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Right Side: Login Card */}
            <div className={`lg:w-[45%] lg:max-w-md w-full transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
               <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[2rem] p-8 lg:p-10 relative overflow-hidden">
                 
                 {/* Soft internal glow for glassmorphism */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/40 z-0"></div>
                 
                 <div className="relative z-10">
                   <div className="mb-8">
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign in to workspace</h2>
                     <p className="text-sm text-slate-500 mt-1 font-medium">Access your exams and dashboards.</p>
                   </div>

                   {error && (
                     <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold flex items-center">
                       {error}
                     </div>
                   )}

                   <form onSubmit={handleLogin} className="space-y-4">
                     
                     <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Email Address</label>
                       <div className="relative flex items-center bg-white border border-slate-200 hover:border-indigo-300 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 shadow-sm">
                          <div className="pl-4 pr-2 text-slate-400">
                            <Mail size={18} />
                          </div>
                          <input
                            type="email"
                            className="w-full bg-transparent text-slate-800 px-2 py-3 outline-none text-sm font-medium placeholder-slate-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setIsFocused('email')}
                            onBlur={() => setIsFocused('')}
                            required
                            placeholder="name@university.edu"
                            autoComplete="email"
                          />
                       </div>
                     </div>

                     <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Password</label>
                       <div className="relative flex items-center bg-white border border-slate-200 hover:border-indigo-300 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 shadow-sm">
                          <div className="pl-4 pr-2 text-slate-400">
                            <Lock size={18} />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-transparent text-slate-800 px-2 py-3 outline-none text-sm font-medium placeholder-slate-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setIsFocused('password')}
                            onBlur={() => setIsFocused('')}
                            required
                            placeholder="••••••••"
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="pr-4 text-slate-400 hover:text-indigo-600 focus:outline-none transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                       </div>
                     </div>

                     <div className="flex items-center justify-between pt-2 mb-2">
                       <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                         <div className="relative flex items-center justify-center">
                           <input type="checkbox" className="peer appearance-none w-4 h-4 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500/20 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer shadow-sm" />
                           <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                         </div>
                         <span className="font-medium">Remember me</span>
                       </label>
                       <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
                     </div>

                     <button
                       type="submit"
                       disabled={loading}
                       className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center"
                     >
                       {loading ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div> : 'Sign In'}
                     </button>
                   </form>

                   <div className="mt-8 text-center border-t border-slate-100 pt-6">
                     <p className="text-sm font-medium text-slate-600">
                       Don't have an account? <span onClick={() => navigate('/register')} className="text-indigo-600 font-bold hover:text-indigo-800 cursor-pointer transition-colors ml-1">Sign up here</span>
                     </p>
                   </div>
                 </div>
               </div>
            </div>
         </section>
      </main>

      {/* Get in Touch Section */}
      <section id="contact" className="relative z-10 w-full py-20 px-6 bg-white/40 backdrop-blur-sm border-t border-indigo-100/50 mt-10">
         <div className="max-w-3xl mx-auto text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Get in Touch</h2>
           <p className="text-slate-600 font-medium">Have questions about QuizSphere? Send us a message and our team will respond shortly.</p>
         </div>
         
         <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col space-y-6">
               <div className="flex flex-col space-y-2 bg-white/60 p-6 rounded-2xl border border-white shadow-sm backdrop-blur-md">
                 <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                   <Mail size={20} />
                 </div>
                 <h4 className="text-sm font-bold text-slate-800">Email</h4>
                 <a href="mailto:pandeysaurav108@gmail.com" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors break-all">pandeysaurav108@gmail.com</a>
               </div>
               
               <div className="flex flex-col space-y-2 bg-white/60 p-6 rounded-2xl border border-white shadow-sm backdrop-blur-md">
                 <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                   <Terminal size={20} />
                 </div>
                 <h4 className="text-sm font-bold text-slate-800">GitHub</h4>
                 <a href="https://github.com/SauravPandey56" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">SauravPandey56</a>
               </div>

               <div className="flex flex-col space-y-2 bg-white/60 p-6 rounded-2xl border border-white shadow-sm backdrop-blur-md">
                 <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                   <Globe size={20} />
                 </div>
                 <h4 className="text-sm font-bold text-slate-800">LinkedIn</h4>
                 <a href="https://www.linkedin.com/in/sauravpandey56" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">sauravpandey56</a>
               </div>
            </div>
            
            <div className="md:col-span-2">
               <div className="bg-white/70 backdrop-blur-xl border border-white shadow-lg rounded-[2rem] p-8">
                 {feedbackSuccess ? (
                   <div className="flex flex-col items-center justify-center h-full space-y-4 py-12 text-center animate-fade-in">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                       <CheckCircle2 size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-slate-800">Thank you!</h3>
                     <p className="text-slate-600 font-medium">Your feedback has been sent to the admin.</p>
                     <button onClick={() => setFeedbackSuccess(false)} className="mt-4 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Send Another Message</button>
                   </div>
                 ) : (
                   <form className="space-y-4 animate-fade-in" onSubmit={handleFeedbackSubmit}>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Name</label>
                         <input type="text" value={feedbackData.name} onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})} required placeholder="John Doe" className="w-full bg-white/50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm" />
                       </div>
                       <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Email</label>
                         <input type="email" value={feedbackData.email} onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})} required placeholder="john@example.com" className="w-full bg-white/50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm" />
                       </div>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Subject</label>
                       <input type="text" value={feedbackData.subject} onChange={(e) => setFeedbackData({...feedbackData, subject: e.target.value})} required placeholder="How can we help?" className="w-full bg-white/50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Message</label>
                       <textarea rows="4" value={feedbackData.message} onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})} required placeholder="Type your message here..." className="w-full bg-white/50 border border-slate-200 hover:border-indigo-300 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm resize-none"></textarea>
                     </div>
                     <button type="submit" disabled={feedbackLoading} className="w-full mt-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0">
                       {feedbackLoading ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div> : <><Send size={18} className="mr-2" /> Send Message</>}
                     </button>
                   </form>
                 )}
               </div>
            </div>
         </div>
      </section>

      {/* Simplified SaaS Footer */}
      <footer className="relative z-10 w-full pb-8 pt-4 flex justify-center items-center">
         <p className="text-sm font-medium text-slate-500">
           © 2026 Saurav Pandey. All rights reserved.
         </p>
      </footer>
    </div>
  );
};

export default Landing;
