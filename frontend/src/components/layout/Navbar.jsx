import React, { useContext } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { DashboardContext } from './DashboardLayout';

const Navbar = ({ activeTabLabel, rightContent }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(DashboardContext);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 w-full transition-all duration-300">
      <div className="flex items-center">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 text-slate-500 hover:text-indigo-600 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block capitalize">
          {activeTabLabel}
        </h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input type="text" placeholder="Search system..." className="pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 border rounded-lg text-sm w-64 transition-all outline-none shadow-sm" />
        </div>
        <button className="relative text-slate-500 hover:text-indigo-600 transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        {rightContent}
      </div>
    </header>
  );
};

export default Navbar;
