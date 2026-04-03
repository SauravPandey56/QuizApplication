import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.role !== 'admin') {
        throw new Error('Not authorized to access Admin Portal');
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="glass-panel-dark w-full max-w-md p-8 relative overflow-hidden border-slate-700">
        
        <div className="relative z-10 flex flex-col items-center">
          <ShieldCheck size={48} className="text-blue-500 mb-4" />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Secure Authentication Area</p>
          </div>

          {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 w-full text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email/Username</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm bg-slate-800/50 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Secret Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm bg-slate-800/50 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-all font-bold tracking-wider"
            >
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
