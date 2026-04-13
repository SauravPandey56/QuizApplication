import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import QuizSphereLogo from '../components/logo/QuizSphereLogo';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication sequence failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Vercel-style Minimalist Ambient Radial Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full animate-fade-in">
        
        <div className="mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <QuizSphereLogo size="lg" layout="horizontal" />
        </div>

        <div className="w-full max-w-[400px]">
           <div className="bg-[#111113]/80 backdrop-blur-3xl border border-white/5 p-8 rounded-[24px] shadow-2xl">
             
             <div className="mb-8 text-center">
               <h1 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h1>
               <p className="text-slate-400 mt-2 text-sm">Enter your details to access your workspace.</p>
             </div>

             {error && (
               <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center justify-center">
                 {error}
               </div>
             )}

             <form onSubmit={handleSubmit} className="space-y-5">
               
               {/* Minimalist Email Input */}
               <div className="relative group/input">
                 <div className={`absolute -inset-0.5 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/40 to-blue-500/40 ${isFocused === 'email' ? 'opacity-100' : ''}`}></div>
                 <div className="relative flex items-center bg-[#1A1A1E] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-indigo-500/50">
                    <div className="pl-4 pr-2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 relative pt-2">
                      <input
                        type="email"
                        id="email"
                        className="w-full bg-transparent text-slate-100 px-2 pt-4 pb-2 outline-none peer text-sm font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused('email')}
                        onBlur={() => setIsFocused('')}
                        required
                        placeholder=" "
                        autoComplete="email"
                      />
                      <label 
                        htmlFor="email"
                        className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-400 pointer-events-none"
                      >
                        Email Address
                      </label>
                    </div>
                 </div>
               </div>

               {/* Minimalist Password Input */}
               <div className="relative group/input">
                 <div className={`absolute -inset-0.5 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/40 to-blue-500/40 ${isFocused === 'password' ? 'opacity-100' : ''}`}></div>
                 <div className="relative flex items-center bg-[#1A1A1E] border border-white/10 rounded-xl overflow-hidden transition-all duration-300 focus-within:border-indigo-500/50">
                    <div className="pl-4 pr-2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors">
                      <Lock size={18} />
                    </div>
                    <div className="flex-1 relative pt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="w-full bg-transparent text-slate-100 px-2 pt-4 pb-2 outline-none peer text-sm font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsFocused('password')}
                        onBlur={() => setIsFocused('')}
                        required
                        placeholder=" "
                      />
                      <label 
                        htmlFor="password"
                        className="absolute text-sm text-slate-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-indigo-400 pointer-events-none"
                      >
                        Password
                      </label>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-4 text-slate-500 hover:text-slate-300 focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                 </div>
               </div>

               <div className="flex items-center justify-between mt-4">
                 <label className="flex items-center space-x-2 text-sm text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                   <div className="relative flex items-center justify-center">
                     <input type="checkbox" className="peer appearance-none w-4 h-4 border border-slate-600 rounded-md checked:bg-indigo-600 checked:border-indigo-600 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer" />
                     <CheckCircle2 size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                   </div>
                   <span>Remember me</span>
                 </label>
                 <a href="#" className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors">Recover Password</a>
               </div>

               <button
                 type="submit"
                 className="w-full mt-6 bg-white text-black font-semibold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center hover:bg-slate-100"
               >
                 Sign In
               </button>
             </form>
           </div>
           
           <p className="mt-8 text-center text-sm font-medium text-slate-500">
             Don't have an account? <span onClick={() => navigate('/register')} className="text-white hover:text-indigo-400 cursor-pointer transition-colors border-b border-transparent hover:border-indigo-400 pb-0.5 ml-1">Sign up</span>
           </p>
        </div>
      </div>
      
      <Footer className="border-t-0" />
    </div>
  );
};

export default Login;
