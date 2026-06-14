import React from 'react';
import { Card } from '../../components/ui/card';
import { ShieldCheck, Users, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const statistics = [
    { label: 'Total Registered Users', count: '142', subtext: 'Clients & Designers combined', icon: <Users size={16} className="text-black" /> },
    { label: 'Verified Atelier Houses', count: '38', subtext: 'Active design firms indexed', icon: <ShieldCheck size={16} className="text-[#D4AF37]" /> },
    { label: 'Pending Authorizations', count: '05', subtext: 'Awaiting credential screening', icon: <ShieldAlert size={16} className="text-rose-600" /> }
  ];

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      {/* Editorial System Header */}
      <div className="border-b border-black/5 pb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
          <Activity size={10} /> Root Executive Session // Core Terminal
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">HQ System Overview</h1>
        <p className="text-xs text-neutral-400 font-mono font-light">Global platform telemetry ledger and data management station.</p>
      </div>

      {/* Analytics Matrix Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statistics.map((stat, idx) => (
          <Card key={idx} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none flex flex-col justify-between luxury-hover">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold">{stat.label}</span>
              <div className="p-1.5 bg-neutral-50 border border-neutral-100">{stat.icon}</div>
            </div>
            <div className="pt-4 space-y-0.5">
              <span className="text-4xl font-luxury text-black block">{stat.count}</span>
              <span className="text-[10px] text-neutral-400 font-mono block">{stat.subtext}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Operational Protocol Callout */}
      <div className="bg-neutral-950 border border-black p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-white">
        <div className="md:col-span-2 space-y-1">
          <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold">System Status Frame</span>
          <h3 className="text-lg font-luxury uppercase tracking-wider">Atelier Integrity Guard Running</h3>
          <p className="text-xs text-neutral-400 font-mono font-light leading-relaxed">
            All data pathways running normally. Cross-origin authorization records matching cryptographic verification handshakes perfectly.
          </p>
        </div>
        <div className="flex justify-end">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono font-bold tracking-widest border border-white/20 bg-white/5 px-4 py-2.5 text-neutral-300">
            System Log Stable
          </span>
        </div>
      </div>
    </div>
  );
};