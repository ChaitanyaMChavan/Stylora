import React from 'react';
import { Card } from '../../components/ui/card';
import { Users, ShieldCheck, CalendarRange, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const metrics = [
    { label: 'Total Registered Users', count: '1,248', icon: <Users size={16} className="text-black" /> },
    { label: 'Verified Ateliers', count: '84', icon: <ShieldCheck size={16} className="text-[#D4AF37]" /> },
    { label: 'Global Consultations', count: '312', icon: <CalendarRange size={16} className="text-black" /> },
  ];

  const serverLogs = [
    { event: 'Database Backup Pipeline Success', time: '12 mins ago', status: 'optimal' },
    { event: 'User ID auth token allocation refresh', time: '44 mins ago', status: 'optimal' },
    { event: 'New Portfolio asset upload stream hook', time: '1 hour ago', status: 'optimal' }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">HQ Terminal</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Macro ecosystem administrative management panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-white p-6 flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase block font-medium">{metric.label}</span>
              <span className="text-3xl font-luxury font-light text-black block">{metric.count}</span>
            </div>
            <div className="p-3 border border-neutral-100 group-hover:border-black/10">
              {metric.icon}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 border border-black/5 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Activity size={14} className="text-[#D4AF37]" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">System Node Telemetry</h3>
          </div>
          
          <div className="space-y-3">
            {serverLogs.map((log, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50/60 border border-neutral-100 text-xs">
                <span className="font-light text-neutral-600">{log.event}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase">{log.time}</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="border border-black/5 bg-black text-white p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Security Protocol</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Ecosystem boundaries running production layer encryption. Any profile token modification requires explicit administrative digital credentials.
          </p>
        </aside>
      </div>
    </div>
  );
};