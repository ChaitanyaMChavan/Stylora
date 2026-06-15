import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Verify this matches your context folder depth
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { NotificationBell } from '../navigation/NotificationBell'; // Adjust path if necessary

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, token, logoutUser } = useAuth();

    // Active token presence check
    const isAuthenticated = !!token || !!localStorage.getItem('stylora_auth_token');

    // Safely extract the role from state or localStorage payload
    const savedUser = localStorage.getItem('stylora_user_payload');
    const userRole = user?.role || (savedUser ? JSON.parse(savedUser).role : null);

    const handleDashboardRedirect = () => {
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'designer') navigate('/designer/dashboard');
        else navigate('/client/dashboard');
    };

    return (
        <nav className="w-full bg-white border-b border-neutral-200/60 px-8 py-4 flex items-center justify-between mx-auto max-w-7xl">
            {/* Brand Logo */}
            <Link to="/" className="text-xl font-luxury uppercase tracking-widest text-black">
                STYLORA
            </Link>

            {/* Center Links */}
            <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase text-neutral-500">
                <Link to="/" className="hover:text-black transition-colors">Home</Link>
                <Link to="/designers" className="hover:text-black transition-colors font-bold text-black">Discover Designers</Link>
            </div>

            {/* Right Side Logic Gates */}
            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    /* Condition A: Logged In User Dashboard Avatar Trigger */
                    <div className="flex items-center gap-3 animate-fade-in">
                        <button
                            onClick={handleDashboardRedirect}
                            className="inline-flex items-center gap-2 border border-black bg-neutral-950 text-white px-4 py-2 text-[10px] font-mono tracking-widest uppercase hover:bg-neutral-900 transition-all rounded-none font-bold"
                        >
                            <LayoutDashboard size={12} className="text-[#D4AF37]" />
                            <span>Workspace Terminal</span>
                        </button>
                        {/* Global Alert System Dropdown */}
                        <NotificationBell />

                        <button
                            onClick={() => {
                                logoutUser();
                                navigate('/');
                            }}
                            className="p-2 border border-neutral-200 text-neutral-400 hover:text-rose-600 hover:border-rose-100 transition-colors rounded-none"
                            title="Logout Session"
                        >
                            <LogOut size={13} />
                        </button>
                    </div>
                ) : (
                    /* Condition B: Guest -> Standard Auth Triggers */
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
                <span className="text-xs uppercase tracking-widest font-mono font-bold text-black">
                    {user?.name}
                </span>
            </div>
        </nav>
    );
};