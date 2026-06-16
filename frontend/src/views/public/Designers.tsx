import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SlidersHorizontal, Loader2, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Define the shape matching your backend mongoose schemas
interface DesignerProfileData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  bio: string;
  location: string;
  style: string;
  experience: number;
  specialization: string;
  profileImage?: string;
  isAvailable: boolean;
}

export const Designers: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [designers, setDesigners] = useState<DesignerProfileData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const isAuthenticated = !!token || !!localStorage.getItem('stylora_auth_token');

  useEffect(() => {
    const fetchLiveDesigners = async () => {
      try {
        setLoading(true);
        // Connect stream to the live backend controller endpoint we just opened
        const response = await axios.get('http://localhost:5000/api/designers');
        
        if (response.data.success) {
          setDesigners(response.data.designers);
        } else {
          setError('Failed to load active catalog ledger stream.');
        }
      } catch (err: any) {
        console.error('Error fetching dynamic database elements:', err);
        setError(err.response?.data?.message || 'Unable to establish channel stream with the designer ledger.');
      } finally {
        setLoading(false);
      }
    };

    fetchLiveDesigners();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-8 py-12 mx-auto max-w-7xl animate-fade-in">
      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200/60 pb-8 mb-12 gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-2">
            Secure Gateway Indexes
          </span>
          <h1 className="text-4xl font-luxury uppercase tracking-wider text-black">
            The Designer Showcase
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-2 tracking-wide">
            Connecting you with verified, active design professionals in real time.
          </p>
        </div>


      </div>

      {/* Logic Gate Rendering States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-neutral-400 font-mono text-xs tracking-widest">
          <Loader2 className="animate-spin text-[#D4AF37]" size={28} />
          <span>SYNCHRONIZING ATELIER DIRECTORY INDEXES...</span>
        </div>
      ) : error ? (
        <div className="border border-rose-200 bg-rose-50/40 p-6 text-center max-w-xl mx-auto rounded-none">
          <span className="text-[10px] bg-rose-950 text-white font-mono px-2 py-0.5 tracking-widest uppercase font-bold">
            ⚠️ Pipeline Exception Logged
          </span>
          <p className="text-xs text-rose-900 font-mono mt-3 tracking-wide">{error}</p>
        </div>
      ) : designers.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-12 text-center max-w-xl mx-auto rounded-none font-mono text-xs tracking-widest text-neutral-400">
          NO REGISTERED DESIGNER CONTROLLER INSTANCES DETECTED IN DATABASE.
        </div>
      ) : (
        /* Dynamic Matrix Grid Stream */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {designers.map((designer) => (
            <div 
              key={designer._id} 
              className="group flex flex-col bg-white border border-neutral-100 hover:border-neutral-300 transition-all p-4"
            >
              {/* Profile Frame Image Section */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-6">
                <img
                  src={designer.profileImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'}
                  alt={designer.userId?.name || 'Designer'}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <span className="absolute bottom-3 left-3 bg-black text-white text-[9px] font-mono tracking-widest uppercase px-2 py-1 rounded-none">
                  {designer.style || 'Signature Minimalist'}
                </span>
              </div>

              {/* Dynamic Information Block */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1 font-bold">
                  <span>✦</span>
                  <span>{designer.experience || 0}+ Years Active Practice</span>
                </div>
                
                <h3 className="text-lg font-luxury uppercase tracking-wider text-black mb-2">
                  {designer.userId?.name || 'Anonymous Studio'}
                </h3>
                
                <p className="text-xs text-neutral-500 line-clamp-2 mb-6 tracking-wide font-light leading-relaxed">
                  {designer.bio || 'No structural biography statement logged.'}
                </p>

                {/* Meta Location Row */}
                <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <MapPin size={11} className="text-neutral-300" />
                    <span>{designer.location || 'Global Operations'}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowLoginModal(true);
                      } else {
                        navigate(`/designer/${designer._id}`);
                      }
                    }}
                    className="text-black font-bold hover:text-[#D4AF37] transition-colors border-b border-black hover:border-[#D4AF37] pb-0.5 text-[10px]"
                  >
                    Enter Stylora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Auth Gate Modal Dialog */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-neutral-200 p-8 max-w-md w-full mx-4 relative animate-scale-up">
            <h3 className="text-xl font-luxury uppercase tracking-widest text-black mb-4">Authentication Required</h3>
            <p className="text-xs font-mono text-neutral-500 tracking-wide mb-8 uppercase leading-relaxed">
              Please sign in to your Stylora workspace account to explore complete designer portfolios and architectural matrix details.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="w-full bg-black text-white py-3 text-[10px] font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors rounded-none font-bold"
              >
                Sign In to Account
              </button>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-white border border-neutral-200 text-neutral-500 py-3 text-[10px] font-mono tracking-widest uppercase hover:text-black hover:border-black transition-colors rounded-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};