import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import Chatbot from '../components/Chatbot';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 pointer-events-none transform -translate-x-10 translate-y-10"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
              <p className="text-slate-500 mt-2">Sign in to your account to continue</p>
            </div>

            {error && <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm bg-white/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
              >
                Sign In
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account? <span onClick={() => navigate('/register')} className="text-indigo-600 hover:underline cursor-pointer">Register here</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Login;
