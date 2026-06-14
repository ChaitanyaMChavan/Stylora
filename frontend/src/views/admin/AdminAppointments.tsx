import React from 'react';
import { Card } from '../../components/ui/card';
import { Clock, Briefcase, RefreshCw } from 'lucide-react';

export const AdminAppointments: React.FC = () => {
  const systemAppointments = [
    { id: 'APT-902', client: 'John Doe', designer: 'Eleanor Vance', date: '2026-10-25', status: 'accepted' },
    { id: 'APT-741', client: 'Sarah Connor', designer: 'Atelier Maurice', date: '2026-11-02', status: 'pending' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Global Appointment Matrix</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Platform consultation ledger queue</p>
      </div>

      <div className="space-y-4">
        {systemAppointments.map((apt) => (
          <Card key={apt.id} className="p-5 bg-white border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow items-center text-xs">
              <div>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase block font-bold">Appointment ID</span>
                <span className="font-mono font-bold text-neutral-800">{apt.id}</span>
              </div>
              <div>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase block">Logistical Edge Entities</span>
                <span className="font-semibold uppercase text-black tracking-wide">{apt.client} <span className="text-neutral-400 font-light lowercase">→</span> {apt.designer}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-500 font-light">
                <Clock size={12} className="text-black" /> {apt.date}
              </div>
            </div>

            <div>
              <span className={`text-[9px] tracking-widest uppercase font-bold px-3 py-1 border block text-center ${
                apt.status === 'accepted' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'
              }`}>
                {apt.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};