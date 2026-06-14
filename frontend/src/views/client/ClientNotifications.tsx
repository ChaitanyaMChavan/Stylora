import React from 'react';
import { Card } from '../../components/ui/card';
import { Bell, ShieldAlert, CheckCircle2, MessageSquare } from 'lucide-react';

export const ClientNotifications: React.FC = () => {
  const alerts = [
    { id: 1, title: 'Atelier Commission Authorized', desc: 'Atelier Maurice accepted your structural design brief for the Penthouse Suite layout.', date: '2 hours ago', icon: <CheckCircle2 size={14} className="text-emerald-600" /> },
    { id: 2, title: 'New Portfolio Blueprint Broadcasted', desc: 'Vanguard Structural cataloged a new project matching your minimalist interest stack.', date: '1 day ago', icon: <Bell size={14} className="text-[#D4AF37]" /> },
    { id: 3, title: 'System Security Log Verified', desc: 'Your account session token was successfully authorized from device terminal node IP:472.10.', date: '3 days ago', icon: <ShieldAlert size={14} className="text-black" /> }
  ];

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">System Signal Gateway</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Notifications Room</h1>
      </div>

      <div className="space-y-4 max-w-4xl">
        {alerts.map((alert) => (
          <Card key={alert.id} className="bg-white p-5 border border-neutral-200/60 rounded-none shadow-none flex items-start gap-4 luxury-hover">
            <div className="p-2 border border-neutral-100 bg-neutral-50 shrink-0">
              {alert.icon}
            </div>
            <div className="space-y-1 flex-grow">
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-black">{alert.title}</h4>
                <span className="text-[9px] font-mono text-neutral-400 whitespace-nowrap">{alert.date}</span>
              </div>
              <p className="text-xs text-neutral-500 font-mono font-light leading-relaxed">{alert.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};