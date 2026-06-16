import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Verify this matches your context folder depth
import { LayoutDashboard, LogOut } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, logoutUser } = useAuth();

  // Active session authentication check flags
  const isAuthenticated = !!token || !!localStorage.getItem('stylora_auth_token');
  
  // Safely extract the role from state or local cache to build exact landing redirections
  const savedUser = localStorage.getItem('stylora_user_payload');
  const userRole = user?.role || (savedUser ? JSON.parse(savedUser).role : null);

  const handleDashboardRedirect = () => {
    if (userRole === 'admin') navigate('/admin');
    else if (userRole === 'designer') navigate('/designer/dashboard');
    else navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      {/* Dynamic Master Structural Navigation Header */}
      <nav className="w-full bg-white border-b border-neutral-200/60 px-8 py-4 flex items-center justify-between unique-navbar-header">
        {/* Brand Logo Identity */}
        <Link to="/" className="text-xl font-luxury uppercase tracking-widest text-black flex items-center gap-2">
          <span className="text-lg">⬡</span> STYLORA
        </Link>

        {/* Center Workspace Matrix Access Paths */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase text-neutral-500">
          <Link to="/" className={`hover:text-black transition-colors ${location.pathname === '/' ? 'font-bold text-black' : ''}`}>Home</Link>
          <Link to="/designers" className={`hover:text-black transition-colors ${location.pathname === '/designers' ? 'font-bold text-black' : ''}`}>Discover Designers</Link>
          <Link to="/about" className={`hover:text-black transition-colors ${location.pathname === '/about' ? 'font-bold text-black' : ''}`}>About Us</Link>
          <Link to="/contact" className={`hover:text-black transition-colors ${location.pathname === '/contact' ? 'font-bold text-black' : ''}`}>Contact Us</Link>
        </div>

        {/* Right Authentication Rendering Logic Gates */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            /* Render this clean workspace panel node if user is currently active and authenticated */
            <div className="flex items-center gap-3 animate-fade-in">
              <button
                onClick={handleDashboardRedirect}
                className="inline-flex items-center gap-2 border border-black bg-neutral-950 text-white px-4 py-2 text-[10px] font-mono tracking-widest uppercase hover:bg-neutral-900 transition-all rounded-none font-bold"
              >
                <LayoutDashboard size={12} className="text-[#D4AF37]" />
                <span>Workspace Terminal</span>
              </button>
              
              <button
                onClick={() => {
                  logoutUser();
                  navigate('/');
                }}
                className="p-2 border border-neutral-200 text-neutral-400 hover:text-rose-600 hover:border-rose-100 transition-colors rounded-none"
                title="Log Out Session"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            /* Fall back to registration links if the visitor browsing is an unauthenticated guest */
            <div className="flex items-center gap-4 animate-fade-in">
              <Link 
                to="/login" 
                className="text-[11px] font-mono tracking-widest uppercase text-neutral-600 hover:text-black transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-black text-white px-4 py-2 text-[11px] font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors rounded-none"
              >
                Join Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Render Subview Outlet Canvas Viewports */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Editorial Footer Matrix */}
      <footer className="w-full bg-white border-t border-neutral-200/60 py-6 px-8 text-center text-[10px] text-neutral-400 font-mono tracking-widest uppercase mt-auto">
        © STYLORA SYSTEM FRAMEWORK V1.0 // 2026
      </footer>
    </div>
  );
};