import React from 'react';
import { Card } from '../../components/ui/card';
import { Bell, Sparkles, CheckCircle } from 'lucide-react';

export const ClientNotifications: React.FC = () => {
  const notifications = [
    { id: 1, text: 'Designer Eleanor Vance approved your consultation slot request for October 25th.', date: '2 hours ago', type: 'system' },
    { id: 2, text: 'Bespoke deposit milestone billing invoice generated successfully.', date: '1 day ago', type: 'payment' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Platform Broadcasts</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Real-time lifestyle status updates</p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {notifications.map((notif) => (
          <Card key={notif.id} className="bg-white p-5 flex items-start gap-4 transition-all hover:border-black/10">
            <div className="p-2 border border-neutral-100 bg-neutral-50">
              {notif.type === 'payment' ? <Sparkles size={14} className="text-[#D4AF37]" /> : <CheckCircle size={14} className="text-black" />}
            </div>
            <div className="space-y-1">
              <p className="text-xs text-neutral-700 leading-relaxed">{notif.text}</p>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 block font-medium">{notif.date}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};