import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, Check, X, ShieldAlert } from 'lucide-react';

export const AdminDesigners: React.FC = () => {
  const [studios, setStudios] = useState([
    { id: 'DSG-771', name: 'Linear Perspective Labs', owner: 'Vikram Mehta', style: 'Industrial Minimalist', status: 'pending' },
    { id: 'DSG-001', name: 'Atelier Maurice', owner: 'Maurice Lefevre', style: 'Mid-Century Modern', status: 'verified' }
  ]);

  const changeStatus = (id: string, nextStatus: 'verified' | 'rejected') => {
    setStudios(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus } : s));
  };

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Atelier Security Clearance</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Verified Designers Board</h1>
      </div>

      <div className="space-y-4">
        {studios.map((studio) => (
          <Card key={studio.id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 lg:grid-cols-12 gap-6 items-center luxury-hover">
            <div className="lg:col-span-3 space-y-0.5">
              <span className="text-[9px] font-mono text-neutral-400 block">{studio.id}</span>
              <h4 className="text-base font-luxury uppercase tracking-wider text-black">{studio.name}</h4>
              <p className="text-xs text-neutral-400 font-mono uppercase">Principal: {studio.owner}</p>
            </div>

            <div className="lg:col-span-3 text-xs font-mono text-neutral-500">
              <span className="block text-[9px] text-neutral-400 uppercase font-bold">Design Philosophy</span>
              <span className="text-black">{studio.style}</span>
            </div>

            <div className="lg:col-span-3">
              <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border ${
                studio.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                studio.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {studio.status === 'verified' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                {studio.status}
              </span>
            </div>

            <div className="lg:col-span-3 flex justify-end gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
              {studio.status === 'pending' && (
                <>
                  <Button variant="outline" size="sm" className="border-rose-200 text-rose-700 hover:bg-rose-700 hover:text-white" onClick={() => changeStatus(studio.id, 'rejected')}>
                    Reject
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => changeStatus(studio.id, 'verified')}>
                    Verify Atelier
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};