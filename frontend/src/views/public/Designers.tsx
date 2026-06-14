import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../services/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { MapPin, Sparkles, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';

interface DesignerProfile {
  _id: string;
  name: string;
  style: string;
  location: string;
  specialization: string;
  experience: number;
  image?: string;
}

export const Designers: React.FC = () => {
  const navigate = useNavigate();
  
  const [designers, setDesigners] = useState<DesignerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  // 1. Premium Static Mock Data to display when a user is not logged in yet
  const staticDesigners: DesignerProfile[] = [
    {
      _id: "static-1",
      name: "Atelier Maurice",
      style: "Mid-Century Modern",
      location: "Paris, France",
      specialization: "Residential Penthouses & Lofts",
      experience: 8,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"
    },
    {
      _id: "static-2",
      name: "Linear Perspective Labs",
      style: "Industrial Minimalist",
      location: "Berlin, Germany",
      specialization: "Commercial Showrooms & Studios",
      experience: 6,
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80"
    },
    {
      _id: "static-3",
      name: "Vanguard Structural",
      style: "Brutalist Contemporary",
      location: "Tokyo, Japan",
      specialization: "Luxury Concrete Villas",
      experience: 12,
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
    }
  ];

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const sessionToken = localStorage.getItem('stylora_auth_token');
      
      // If no token exists, keep loading false and fall back to the static array representation
      if (!sessionToken) {
        setIsAuthed(false);
        setDesigners(staticDesigners);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setIsAuthed(true);

        // If logged in, hit your active authenticated endpoint layout channel
        const response = await API.get('/designers/profile/me'); 
        
        // Normalize the payload response state context safely
        let payload = [];
        if (Array.isArray(response.data)) {
          payload = response.data;
        } else if (response.data.profile) {
          payload = [response.data.profile];
        } else if (response.data.designer) {
          payload = [response.data.designer];
        } else {
          payload = [response.data];
        }
        
        setDesigners(payload.length > 0 ? payload : staticDesigners);
      } catch (err: any) {
        console.error('Authenticated database fetch fell back to static view:', err);
        // Fall back gracefully to static view if the token is expired or unauthorized
        setIsAuthed(false);
        setDesigners(staticDesigners);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  // 2. Intercept actions: If user is authenticated, let them look deep; if not, route to credentials desk
  const handleActionClick = (designerId: string) => {
    if (!isAuthed) {
      navigate('/login');
    } else {
      navigate(`/designer/${designerId}`);
    }
  };

  return (
    <div className="space-y-12 py-4 animate-fade-in">
      {/* Editorial Row Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">
            {isAuthed ? "Secure Gateway Indexes" : "Public Guest Exhibition"}
          </span>
          <h1 className="text-4xl font-luxury text-black uppercase tracking-wide">The House Roster</h1>
          <p className="text-xs text-neutral-400 font-light">
            {isAuthed ? "Viewing authenticated active spatial interior architect profiles" : "Sign in to access secure studio scheduling booking mechanics"}
          </p>
        </div>
        
        <div className="flex items-center gap-2 border border-neutral-200 px-4 py-2 text-xs uppercase tracking-widest font-mono font-medium cursor-pointer hover:border-black transition-colors bg-white">
          <SlidersHorizontal size={12} /> Refine Matrix View
        </div>
      </div>

      {loading && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs">
          <Loader2 size={24} className="animate-spin text-black" />
          <span>Synchronizing Atelier Ledgers...</span>
        </div>
      )}

      {error && (
        <div className="p-6 border border-rose-100 bg-rose-50/50 text-rose-700 max-w-2xl mx-auto space-y-3 rounded-none">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
            <AlertCircle size={14} /> Pipeline Exception Logged
          </div>
          <p className="text-xs font-mono font-light">{error}</p>
        </div>
      )}

      {/* Dynamic Render Canvas Grid */}
      {!loading && designers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {designers.map((designer) => (
            <Card key={designer._id} className="p-0 overflow-hidden bg-white luxury-hover flex flex-col justify-between rounded-none shadow-none border border-neutral-200/60">
              <div className="h-64 bg-neutral-100 relative overflow-hidden group">
                <img 
                  src={designer.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80"} 
                  alt={designer.name} 
                  className="w-full h-full object-cover grayscale opacity-95 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-black text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold font-mono">
                  {designer.style}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                    <Sparkles size={10} /> {designer.experience}+ Years Active Practice
                  </div>
                  <h3 className="text-xl font-luxury uppercase tracking-wide text-black pt-0.5">{designer.name}</h3>
                  <p className="text-xs text-neutral-400 font-light italic truncate">
                    Specializing in {designer.specialization}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-1 text-xs text-neutral-500 font-light">
                    <MapPin size={12} className="text-black" /> {designer.location}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleActionClick(designer._id)}
                  >
                    {isAuthed ? 'Enter Atelier' : 'Sign In to View'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};