import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  role: 'client' | 'designer' | 'admin';
  menuItems: SidebarItem[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, menuItems }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  return (
    <div className="min-h-screen flex bg-[#FBFBFA]">
      {/* Desktop Persistent Panel */}
      <aside className="hidden lg:flex flex-col w-64 bg-black text-white border-r border-neutral-900 p-6 shrink-0 justify-between">
        <div>
          <div className="text-xl font-luxury tracking-widest mb-10 text-white">
            STYLORA <span className="text-xs tracking-normal font-sans text-neutral-500 block uppercase mt-1">{role} space</span>
          </div>
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest transition-all duration-300 ${
                    isActive ? 'bg-[#D4AF37] text-black font-semibold' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button 
          onClick={() => {
            logoutUser();
            navigate('/login');
          }} 
          className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-red-400 hover:bg-neutral-900 transition-colors w-full text-left cursor-pointer"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </aside>

      {/* Mobile Shell Framework */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-black/5">
          <button onClick={() => setIsSidebarOpen(true)} className="text-black">
            <Menu size={20} />
          </button>
          <div className="text-lg font-luxury tracking-widest">STYLORA</div>
          <div className="w-5" />
        </header>

        {/* Mobile Slide Drawer Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-64 bg-black text-white p-6 flex flex-col justify-between" onClick={e => e.stopPropagation()}>
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="font-luxury tracking-widest text-lg">STYLORA</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-white"><X size={20} /></button>
                </div>
                <nav className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Link
                       key={item.path}
                       to={item.path}
                       onClick={() => setIsSidebarOpen(false)}
                       className="flex items-center gap-3 py-3 text-xs uppercase tracking-widest text-neutral-400"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <button 
                onClick={() => {
                  logoutUser();
                  navigate('/login');
                }} 
                className="flex items-center gap-3 py-3 text-xs uppercase tracking-widest text-red-400"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};