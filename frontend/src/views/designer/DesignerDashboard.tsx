import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Sparkles, Calendar, MapPin, Clock, Check, X, ShieldCheck } from 'lucide-react';

export const DesignerDashboard: React.FC = () => {
  // Local state managing interactive client booking approvals
  const [incomingCommissions, setIncomingCommissions] = useState([
    { id: 'APT-8492', clientName: 'Chaitanya Chavan', date: '2026-07-14', time: '10:00 AM', service: 'Spatial Consultation', location: 'Penthouse Suite B, Koregaon Park', notes: 'Needs a complete mid-century restructuring with a focus on geometric lighting layout changes.', status: 'pending' },
    { id: 'APT-9102', clientName: 'Ananya Sharma', date: '2026-07-28', time: '02:30 PM', service: 'Spatial Auditing', location: 'Commercial Studio Annex', notes: 'Wants an executive showroom structural overview audit.', status: 'pending' }
  ]);

  const updateStatus = (id: string, nextStatus: 'accepted' | 'declined') => {
    setIncomingCommissions(prev => 
      prev.map(item => item.id === id ? { ...item, status: nextStatus } : item)
    );
  };

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      {/* Editorial Dashboard Banner */}
      <div className="border-b border-black/5 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
            <Sparkles size={10} /> Studio Engine Core // Secure Entry
          </div>
          <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Atelier Operational Hub</h1>
          <p className="text-xs text-neutral-400 font-mono font-light">Evaluate requested design metrics and manage system access channels.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-100 font-bold">
            Status: Accepting Commissions
          </span>
        </div>
      </div>

      {/* Operations Performance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none">
          <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold block">Pending Proposals</span>
          <span className="text-4xl font-luxury text-black block pt-2">
            {incomingCommissions.filter(c => c.status === 'pending').length}
          </span>
        </Card>
        <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none">
          <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold block">Active Active Commissions</span>
          <span className="text-4xl font-luxury text-black block pt-2">
            {incomingCommissions.filter(c => c.status === 'accepted').length + 4}
          </span>
        </Card>
        <Card className="bg-neutral-950 border border-black p-6 text-white flex flex-col justify-between rounded-none shadow-none">
          <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold block">Network Authority Check</span>
          <span className="text-xs text-neutral-400 font-mono font-light pt-1">All architecture metrics comply with platform verification standard v2.4.</span>
        </Card>
      </div>

      {/* Live Booking Management Panel */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-neutral-100 pb-2">
          Incoming Spatial Brief Streams
        </h3>

        <div className="space-y-4">
          {incomingCommissions.map((comm) => (
            <Card key={comm.id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none luxury-hover space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-neutral-100 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-neutral-400 block">{comm.id}</span>
                  <h4 className="text-base font-luxury uppercase tracking-wider text-black">{comm.clientName}</h4>
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">{comm.service}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border ${
                    comm.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    comm.status === 'declined' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {comm.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-neutral-600">
                <div className="flex items-center gap-2"><Calendar size={13} className="text-black" /> {comm.date}</div>
                <div className="flex items-center gap-2"><Clock size={13} className="text-neutral-400" /> {comm.time}</div>
                <div className="flex items-center gap-2 truncate"><MapPin size={13} className="text-[#D4AF37]" /> {comm.location}</div>
              </div>

              <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-none">
                <span className="block text-[9px] uppercase tracking-widest font-bold text-neutral-400 mb-1">Client Design Intent Statement</span>
                <p className="text-xs text-neutral-600 font-light font-mono leading-relaxed">"{comm.notes}"</p>
              </div>

              {comm.status === 'pending' && (
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" className="border-rose-200 text-rose-700 hover:bg-rose-700 hover:text-white" onClick={() => updateStatus(comm.id, 'declined')}>
                    <X size={12} className="mr-1" /> Decline Proposal
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => updateStatus(comm.id, 'accepted')}>
                    <Check size={12} className="mr-1" /> Authorize Commission
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};