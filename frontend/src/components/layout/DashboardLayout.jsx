import React, { useState, useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';

// Create a Context so child headers can toggle the sidebar state
export const DashboardContext = createContext();

const DashboardLayout = ({ sidebar, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on mobile when route navigation happens
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <DashboardContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden relative font-sans text-slate-800">
        
        {/* Mobile Overlay Background */}
        <div 
          className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300 pointer-events-auto ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Generic Sidebar Component */}
        {sidebar}

        {/* Main Viewport Window */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-0">
           {children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;
