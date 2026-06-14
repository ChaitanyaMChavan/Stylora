import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Calendar, MapPin, XCircle, Clock, ShieldQuestion, CheckCircle } from 'lucide-react';

export const ClientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState([
    { id: 'APT-8492', designer: 'Atelier Maurice', date: '2026-07-14', time: '10:00 AM', service: 'Spatial Consultation', status: 'accepted', location: 'Penthouse Suite B, Koregaon Park' },
    { id: 'APT-9102', designer: 'Vanguard Structural', date: '2026-07-28', time: '02:30 PM', service: 'Spatial Auditing', status: 'pending', location: 'Commercial Studio Annex' },
    { id: 'APT-7123', designer: 'Kanso Interiors', date: '2026-05-19', time: '11:00 AM', service: 'Turnkey Execution', status: 'completed', location: 'Luxury Villa, Lonavala' }
  ]);

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt));
  };

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Historical Auditing Ledger</span>
          <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Your Appointment Matrix</h1>
        </div>
        <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase">Total Records: {appointments.length}</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {appointments.map((apt) => (
          <Card key={apt.id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-3 space-y-1">
              <span className="text-[9px] font-mono text-neutral-400">{apt.id}</span>
              <h3 className="text-base font-luxury uppercase tracking-wider text-black">{apt.designer}</h3>
              <p className="text-xs text-neutral-400 font-mono uppercase">{apt.service}</p>
            </div>

            <div className="lg:col-span-3 text-xs text-neutral-600 font-mono space-y-1">
              <div className="flex items-center gap-2"><Calendar size={13} className="text-black" /> {apt.date}</div>
              <div className="flex items-center gap-2"><Clock size={13} className="text-neutral-400" /> {apt.time}</div>
            </div>

            <div className="lg:col-span-3 text-xs text-neutral-500 font-light flex items-start gap-1.5">
              <MapPin size={13} className="text-[#D4AF37] mt-0.5 shrink-0" />
              <span>{apt.location}</span>
            </div>

            <div className="lg:col-span-3 flex flex-row sm:items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border ${
                apt.status === 'completed' ? 'bg-neutral-900 text-white border-black' :
                apt.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                apt.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {apt.status}
              </span>

              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                <Button variant="outline" size="sm" className="border-rose-200 text-rose-700 hover:bg-rose-700 hover:text-white" onClick={() => handleCancel(apt.id)}>
                  <XCircle size={12} className="mr-1" /> Cancel Booking
                </Button>
              )}
            </div>

          </Card>
        ))}
      </div>
    </div>
  );
};