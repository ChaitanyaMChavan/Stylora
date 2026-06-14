import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Mail, Sparkles, ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface DesignerProfileDetail {
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
  phone: string;
  profileImage?: string;
  isAvailable: boolean;
}

export const DesignerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [designer, setDesigner] = useState<DesignerProfileDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesignerProfile = async () => {
      try {
        setLoading(true);
        // Connect directly to GET /api/designers/profile/:id
        const response = await axios.get(`http://localhost:5000/api/designers/profile/${id}`);
        
        if (response.data.success) {
          setDesigner(response.data.profile);
        } else {
          setError('Failed to extract profile metadata records from the schema ledger.');
        }
      } catch (err: any) {
        console.error('Error fetching deep profile parameters:', err);
        setError(err.response?.data?.message || 'Could not map communication lines with this specific designer atelier instance.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDesignerProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-4 font-mono text-xs tracking-widest text-neutral-400">
        <Loader2 className="animate-spin text-[#D4AF37]" size={28} />
        <span>STREAMING ATELIER PROFILE INDEXES...</span>
      </div>
    );
  }

  if (error || !designer) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-8">
        <div className="border border-rose-200 bg-rose-50/40 p-6 text-center max-w-xl w-full rounded-none">
          <span className="text-[10px] bg-rose-950 text-white font-mono px-2 py-0.5 tracking-widest uppercase font-bold">
            ⚠️ Profile Channel Resolution Failure
          </span>
          <p className="text-xs text-rose-900 font-mono mt-3 tracking-wide mb-6">{error || 'Atelier instance missing.'}</p>
          <button 
            onClick={() => navigate('/designers')}
            className="inline-flex items-center gap-2 border border-black bg-black text-white px-4 py-2 text-[10px] font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Return to Master Roster</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-8 py-12 mx-auto max-w-6xl animate-fade-in">
      {/* Return Controls navigation layer */}
      <button
        onClick={() => navigate('/designers')}
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-black font-mono text-[10px] tracking-widest uppercase mb-12 transition-colors group"
      >
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to House Roster</span>
      </button>

      {/* Main Structural Core Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column Aspect: Profile Imagery and Snapshot Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="border border-neutral-200/80 p-4 bg-white">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
              <img
                src={designer.profileImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop'}
                alt={designer.userId?.name || 'Designer'}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </div>

          {/* Quick Contact metadata matrix status card */}
          <div className="border border-neutral-200/60 bg-white p-6 font-mono text-[11px] tracking-wide text-neutral-500 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="uppercase text-neutral-400">Atelier Status</span>
              {designer.isAvailable ? (
                <span className="inline-flex items-center gap-1 text-emerald-600 uppercase font-bold text-[10px]">
                  <CheckCircle2 size={12} /> Accepting Commissions
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-600 uppercase font-bold text-[10px]">
                  <XCircle size={12} /> Booked Full
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <MapPin size={12} className="text-neutral-400" />
              <span className="uppercase">{designer.location || 'Global Base'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-neutral-400" />
              <span>{designer.userId?.email || 'comms@stylora.system'}</span>
            </div>
          </div>
        </div>

        {/* Right Column Aspect: Deep Architectural Profile Data Details */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-2">
              Signature Style // {designer.style || 'Avant-Garde'}
            </span>
            <h1 className="text-4xl font-luxury uppercase tracking-wider text-black mb-3">
              {designer.userId?.name || 'Architect Studio'}
            </h1>
            <div className="inline-flex items-center gap-1.5 border border-neutral-200 bg-white px-3 py-1 font-mono text-[10px] tracking-widest text-neutral-500 uppercase">
              <span>{designer.experience || 0} Years Active Experience</span>
            </div>
          </div>

          {/* Narrative Biography Row */}
          <div className="border-t border-neutral-200/60 pt-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-3">Atelier Manifesto</h3>
            <p className="text-sm text-neutral-600 font-light leading-relaxed tracking-wide whitespace-pre-line">
              {designer.bio || 'This designer has not yet logged a master structural biography manifesto statement.'}
            </p>
          </div>

          {/* Core Specializations Layout Blocks */}
          <div className="border-t border-neutral-200/60 pt-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-4">Core Spatial Scope</h3>
            <div className="flex flex-wrap gap-2">
              {designer.specialization ? (
                designer.specialization.split(',').map((spec, index) => (
                  <span 
                    key={index} 
                    className="bg-neutral-900 text-white text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 rounded-none"
                  >
                    {spec.trim()}
                  </span>
                ))
              ) : (
                <span className="text-xs font-mono text-neutral-400 italic">No direct specializations mapped.</span>
              )}
            </div>
          </div>

          {/* Action Call Pipeline trigger for client booking scheduling */}
          <div className="pt-8 border-t border-neutral-200/60">
            <button 
              disabled={!designer.isAvailable}
              onClick={() => navigate(`/client/appointments?designerId=${designer._id}`)}
              className="w-full bg-black text-white px-6 py-4 text-xs font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors rounded-none disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar size={14} className={designer.isAvailable ? "text-[#D4AF37]" : ""} />
              <span>Initiate Consultation Request</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};