import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 text-black flex flex-col justify-between font-sans selection:bg-black selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-black/5 z-50 px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield size={18} className="text-black group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-luxury uppercase tracking-widest text-lg font-bold">Stylora</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-medium text-neutral-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <Link to="/designers" className="hover:text-black transition-colors font-bold text-black">Discover Designers</Link>
          <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-black transition-colors">Contact Us</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-[11px] uppercase tracking-widest font-medium text-neutral-500 hover:text-black transition-colors">
            Sign In
          </Link>
          <button 
            onClick={() => navigate('/register')}
            className="border border-black bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-900 transition-colors cursor-pointer font-mono"
          >
            Join Register
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-grow px-6 lg:px-16 py-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>

      {/* Footer Block */}
      <footer className="bg-white border-t border-black/5 px-6 lg:px-16 py-10 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-neutral-400" />
            <span className="font-luxury uppercase tracking-widest text-xs text-neutral-400">Stylora System Framework © 2026</span>
          </div>

          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <Link to="/designers" className="hover:text-black transition-colors">Atelier Index</Link>
            <Link to="/about" className="hover:text-black transition-colors">The Manifesto</Link>
            <Link to="/contact" className="hover:text-black transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};