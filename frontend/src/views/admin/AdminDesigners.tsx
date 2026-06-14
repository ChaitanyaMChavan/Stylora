import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Star, ShieldCheck, ShieldAlert } from 'lucide-react';

export const AdminDesigners: React.FC = () => {
  const [studios, setStudios] = useState([
    { id: 'DSG-44', name: 'Atelier Maurice', location: 'Paris, France', style: 'Mid-Century', verified: true },
    { id: 'DSG-89', name: 'Sora Takahashi', location: 'Tokyo, Japan', style: 'Japandi', verified: false }
  ]);

  const toggleVerification = (id: string) => {
    setStudios(prev => prev.map(studio => 
      studio.id === id ? { ...studio, verified: !studio.verified } : studio
    ));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Verified Designer Roster</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Certify studio registration licenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studios.map((studio) => (
          <Card key={studio.id} className="bg-white p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{studio.id} • {studio.style}</span>
                <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 border ${studio.verified ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                  {studio.verified ? 'Verified Atelier' : 'Pending Verification Review'}
                </span>
              </div>
              <h3 className="text-lg font-luxury text-black uppercase tracking-wide pt-1">{studio.name}</h3>
              <p className="text-xs text-neutral-500 font-light">{studio.location}</p>
            </div>

            <div className="pt-2 border-t border-neutral-50 flex justify-end">
              <button
                onClick={() => toggleVerification(studio.id)}
                className={`inline-flex items-center gap-1 px-4 py-2 border text-[10px] uppercase font-bold tracking-widest transition-all cursor-pointer ${studio.verified ? 'border-neutral-200 text-neutral-500 hover:border-black hover:text-black' : 'border-black bg-black text-white hover:bg-neutral-900'}`}
              >
                {studio.verified ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                {studio.verified ? 'Revoke Seal' : 'Grant Verified Seal'}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};