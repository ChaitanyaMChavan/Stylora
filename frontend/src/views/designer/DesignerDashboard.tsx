import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { LayoutDashboard, Calendar, Image, Check, X } from 'lucide-react';

export const DesignerDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [recentRequests, setRecentRequests] = useState([
    { id: 'APT-104', client: 'John Doe', date: '2026-06-20', time: '11:00 AM', type: 'Consultation', notes: 'Looking for living room redesign' }
  ]);

  const handleAction = (id: string, decision: 'accepted' | 'rejected') => {
    setRecentRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Studio Engine</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Manage your elite design house operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white p-6 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase block font-medium">Active Bookings</span>
            <span className="text-3xl font-luxury font-light text-black block">4</span>
          </div>
          <div className="p-3 border border-neutral-100 group-hover:border-black/10">
            <Calendar size={16} className="text-[#D4AF37]" />
          </div>
        </Card>

        <Card className="bg-white p-6 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase block font-medium">Lookbook Items</span>
            <span className="text-3xl font-luxury font-light text-black block">12</span>
          </div>
          <div className="p-3 border border-neutral-100 group-hover:border-black/10">
            <Image size={16} className="text-black" />
          </div>
        </Card>

        <Card className="bg-white p-6 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase block font-medium">Studio Rating</span>
            <span className="text-3xl font-luxury font-light text-black block">5.0</span>
          </div>
          <div className="p-3 border border-neutral-100 group-hover:border-black/10">
            <LayoutDashboard size={16} className="text-[#D4AF37]" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">Incoming Consultation Requests</h3>
          </div>

          {recentRequests.length > 0 ? (
            recentRequests.map((req) => (
              <div key={req.id} className="border border-black/5 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase block font-bold">{req.id} • {req.type}</span>
                  <h4 className="text-sm font-semibold uppercase text-black tracking-wide">{req.client}</h4>
                  <p className="text-xs text-neutral-500 font-light">{req.date} @ {req.time}</p>
                  <p className="text-[11px] text-neutral-400 font-light italic mt-1">"{req.notes}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAction(req.id, 'accepted')}
                    className="p-2.5 border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                    title="Accept Window"
                  >
                    <Check size={14} />
                  </button>
                  <button 
                    onClick={() => handleAction(req.id, 'rejected')}
                    className="p-2.5 border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                    title="Decline Request"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-neutral-400 uppercase tracking-widest bg-white border border-dashed border-neutral-200">
              No pending requests in stream
            </div>
          )}
        </div>

        <aside className="border border-black/5 bg-white p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-neutral-100 pb-2">Studio Shortcuts</h3>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" fullWidth className="justify-start text-left" onClick={() => navigate('/designer/portfolio')}>
              Manage Lookbooks
            </Button>
            <Button variant="outline" size="sm" fullWidth className="justify-start text-left" onClick={() => navigate('/designer/profile')}>
              Update Studio Identity
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};