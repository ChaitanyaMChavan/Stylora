import React from 'react';
import { Card } from '../../components/ui/card';
import { Calendar, User, LayoutDashboard, Clock } from 'lucide-react';

export const AdminAppointments: React.FC = () => {
  const masterLog = [
    { aid: 'APT-8492', client: 'Chaitanya Chavan', designer: 'Atelier Maurice', date: '2026-07-14', time: '10:00 AM', status: 'accepted' },
    { aid: 'APT-9102', client: 'Ananya Sharma', designer: 'Vanguard Structural', date: '2026-07-28', time: '02:30 PM', status: 'pending' }
  ];

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Cross-Network Audit Trail</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">System Appointments Master Log</h1>
      </div>

      <div className="space-y-4">
        {masterLog.map((log) => (
          <Card key={log.aid} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono text-xs">
            <div className="space-y-1">
              <span className="text-[9px] text-neutral-400 block">{log.aid}</span>
              <div className="flex items-center gap-1.5 text-black"><User size={12} className="text-[#D4AF37]" /> <span className="uppercase font-bold">{log.client}</span></div>
              <div className="text-[10px] text-neutral-400">Targeting: {log.designer}</div>
            </div>

            <div className="space-y-1 text-neutral-600">
              <div className="flex items-center gap-1.5"><Calendar size={12} /> {log.date}</div>
              <div className="flex items-center gap-1.5"><Clock size={12} /> {log.time}</div>
            </div>

            <div>
              <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">Stream Router Path</span>
              <span className="text-neutral-600 text-[11px] font-bold">/api/appointments/verify</span>
            </div>

            <div className="flex justify-end">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border ${
                log.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {log.status}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};