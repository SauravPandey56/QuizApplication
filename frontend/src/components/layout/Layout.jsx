import React, { useContext, useState } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import Chatbot from '../Chatbot';
import Footer from './Footer';
import QuizSphereLogo from '../logo/QuizSphereLogo';
import AnimatedBackground from './AnimatedBackground';
import axios from 'axios';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <Navigate to="/login" />;
  
  const isAttemptScreen = location.pathname.includes('/attempt/');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (user.role === 'admin' || user.role === 'examiner' || user.role === 'candidate') {
    return (
      <div className="min-h-screen bg-transparent font-sans text-slate-800 flex overflow-hidden relative">
        <AnimatedBackground />
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <AnimatedBackground />
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link to="/" className="flex items-center">
              <QuizSphereLogo size="sm" />
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 font-medium hidden sm:block">
                Welcome, {user.name} ({user.role})
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/80 transition-all text-slate-700 shadow-sm border border-slate-200"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {!isAttemptScreen && <Footer />}
      {!isAttemptScreen && <Chatbot />}
    </div>
  );
};

export default Layout;
