import React, { useContext } from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, FileText, CheckSquare, Users } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                QuizSphere
              </span>
            </div>
            
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

      <footer className="py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} QuizSphere Application.
      </footer>
    </div>
  );
};

export default Layout;
