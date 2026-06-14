import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, MapPin, CheckCircle, Shield } from 'lucide-react';

export const DesignerAppointments: React.FC = () => {
  const [bookings, setBookings] = useState([
    { id: 'APT-8492', client: 'Chaitanya Chavan', date: '2026-07-14', time: '10:00 AM', service: 'Spatial Consultation', location: 'Penthouse Suite B, Koregaon Park', status: 'accepted' },
    { id: 'APT-7123', client: 'Rohit Deshmukh', date: '2026-05-19', time: '11:00 AM', service: 'Turnkey Execution', location: 'Luxury Villa, Lonavala', status: 'completed' }
  ]);

  const handleMarkComplete = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'completed' } : b));
  };

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Studio Execution Stream</span>
          <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Bespoke Bookings Manager</h1>
        </div>
        <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase">Total Ledger Nodes: {bookings.length}</span>
      </div>

      <div className="space-y-4">
        {bookings.map((b) => (
          <Card key={b.id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 lg:grid-cols-12 gap-4 items-center luxury-hover">
            <div className="lg:col-span-3 space-y-0.5">
              <span className="text-[9px] font-mono text-neutral-400 block">{b.id}</span>
              <h4 className="text-sm font-luxury uppercase text-black tracking-wider">{b.client}</h4>
              <p className="text-[10px] text-neutral-400 font-mono uppercase font-medium">{b.service}</p>
            </div>

            <div className="lg:col-span-3 text-xs font-mono text-neutral-600 space-y-1">
              <div className="flex items-center gap-2"><Calendar size={13} className="text-black" /> {b.date}</div>
              <div className="flex items-center gap-2"><Clock size={13} className="text-neutral-400" /> {b.time}</div>
            </div>

            <div className="lg:col-span-3 text-xs text-neutral-500 font-light flex items-center gap-1.5">
              <MapPin size={13} className="text-[#D4AF37] shrink-0" />
              <span className="truncate font-mono">{b.location}</span>
            </div>

            <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border ${
                b.status === 'completed' ? 'bg-neutral-900 text-white border-black' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {b.status}
              </span>

              {b.status === 'accepted' && (
                <Button variant="outline" size="sm" onClick={() => handleMarkComplete(b.id)}>
                  <CheckCircle size={12} className="mr-1" /> Mark Finalized
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};