import React, { useContext } from 'react';
import { DashboardContext } from './DashboardLayout';
import QuizSphereLogo from '../logo/QuizSphereLogo';
import { LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ menuItems, activeTab, setActiveTab, userRole, customHeader, customTopSpace }) => {
  const { isSidebarOpen } = useContext(DashboardContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 h-full flex flex-col transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
      }`}
    >
      <div className={`h-16 flex border-b border-slate-800 items-center justify-between shrink-0 bg-slate-900 ${isSidebarOpen ? 'px-6' : 'px-0 justify-center'}`}>
         <QuizSphereLogo size="sm" showText={isSidebarOpen} />
      </div>
      
      {customHeader && (
        <div className={`transition-opacity duration-300 overflow-hidden ${!isSidebarOpen ? 'max-h-0 opacity-0 md:hidden' : 'opacity-100'}`}>
           {customHeader}
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        {customTopSpace && isSidebarOpen && <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">{customTopSpace}</p>}
        {!customTopSpace && isSidebarOpen && <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">{userRole || 'Menu'}</p>}
        
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center py-2.5 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-indigo-600 focus:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-medium' 
                : 'hover:bg-slate-800 hover:text-white'
            } ${isSidebarOpen ? 'px-3 space-x-3' : 'justify-center px-0'}`}
            title={!isSidebarOpen ? item.label : ''}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-indigo-200 shrink-0' : 'text-slate-400 shrink-0'} />
            {isSidebarOpen && (
               <>
                 <span className="whitespace-nowrap flex-1 text-left">{item.label}</span>
                 {item.badge && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>}
               </>
            )}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button onClick={handleLogout} className={`flex items-center text-slate-400 hover:text-white transition-colors w-full py-2 ${isSidebarOpen ? 'px-3 space-x-3' : 'justify-center px-0'}`} title="Log out">
          <LogOut size={20} className="shrink-0" />
          {isSidebarOpen && <span className="whitespace-nowrap">Sign Out securely</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
