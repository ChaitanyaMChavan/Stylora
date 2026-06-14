import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Calendar, Bell, Star, ArrowUpRight } from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock aggregated metrics tracking client states
  const metrics = [
    { label: 'Active Projects', count: '2', icon: <Calendar size={16} className="text-[#D4AF37]" /> },
    { label: 'Unread Alerts', count: '3', icon: <Bell size={16} className="text-black" /> },
    { label: 'Published Reviews', count: '5', icon: <Star size={16} className="text-[#D4AF37]" /> },
  ];

  const ongoingConsultations = [
    { id: 'APT-902', designer: 'Eleanor Vance', date: 'Oct 25, 2024', status: 'accepted', type: 'Consultation' },
    { id: 'APT-741', designer: 'Atelier Maurice', date: 'Nov 02, 2024', status: 'pending', type: 'Spatial Auditing' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Editorial Welcome Header */}
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">The Salon Workspace</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Manage your private spatial commissions</p>
      </div>

      {/* Grid Metrics Rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-white p-6 flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase block font-medium">{metric.label}</span>
              <span className="text-3xl font-luxury font-light text-black block">{metric.count}</span>
            </div>
            <div className="p-3 border border-neutral-100 group-hover:border-black/10 transition-colors">
              {metric.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Direct Workspace Operational Splitting Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Section: Booking Overviews */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-black">Active Consultations</h3>
            <Button variant="outline" size="sm" className="text-[10px] p-0" onClick={() => navigate('/client/appointments')}>
              View All Windows <ArrowUpRight size={12} className="ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {ongoingConsultations.map((apt) => (
              <div key={apt.id} className="border border-black/5 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] tracking-widest text-neutral-400 uppercase block">{apt.id} • {apt.type}</span>
                  <h4 className="text-sm font-semibold uppercase text-black tracking-wide">{apt.designer}</h4>
                  <p className="text-xs text-neutral-500 font-light">{apt.date}</p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <span className={`text-[9px] tracking-widest uppercase font-bold px-3 py-1 border ${
                    apt.status === 'accepted' ? 'text-emerald-700 bg-emerald-50/50 border-emerald-200/40' : 'text-amber-700 bg-amber-50/50 border-amber-200/40'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel: Quick Actions Context Card */}
        <aside className="border border-black/5 bg-black text-white p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4AF37]">Design Concierge</h3>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            Ready to initiate a brand-new space transform blueprint? Look through our certified, curated master roster index.
          </p>
          <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/designers')}>
            Browse The Atelier Index
          </Button>
        </aside>
      </div>
    </div>
  );
};