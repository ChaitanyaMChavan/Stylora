import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, MapPin, Sparkles, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Search, ArrowRight } from 'lucide-react'; 

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock active engagements mapped perfectly to your Appointment model payload shape
  const activeAppointments = [
    {
      id: 'APT-8492',
      designerName: 'Atelier Maurice',
      appointmentDate: '2026-07-14',
      appointmentTime: '10:00 AM',
      serviceType: 'Consultation',
      status: 'accepted',
      location: 'Penthouse Suite B, Koregaon Park'
    },
    {
      id: 'APT-9102',
      designerName: 'Vanguard Structural',
      appointmentDate: '2026-07-28',
      appointmentTime: '02:30 PM',
      serviceType: 'Spatial Auditing',
      status: 'pending',
      location: 'Commercial Studio Annex'
    }
  ];

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      {/* Editorial Welcome Header */}
      <div className="border-b border-black/5 pb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
          <Sparkles size={10} /> Client Session Terminal // Active
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">
          Welcome Back, Chaitanya Chavan
        </h1>
        <p className="text-xs text-neutral-400 font-mono font-light">
          Monitor your private blueprints, active consultation pipelines, and design studio streams.
        </p>
      </div>

      {/* Metrics Row Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none flex flex-col justify-between">
          <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold">Total Dispatched Briefs</span>
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-3xl font-luxury text-black">02</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold uppercase">Active Stream</span>
          </div>
        </Card>
        <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none flex flex-col justify-between">
          <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold">Verified Atelier Clearances</span>
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-3xl font-luxury text-black">01</span>
            <span className="text-[10px] text-[#D4AF37] font-mono font-bold uppercase">Confirmed Room</span>
          </div>
        </Card>
       <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none flex flex-col justify-between luxury-hover">
  <div className="space-y-1">
    <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold">Marketplace Engine</span>
    <h3 className="text-sm font-luxury uppercase tracking-wider text-black">Commission New Spaces</h3>
    <p className="text-[11px] text-neutral-400 font-mono font-light leading-relaxed">
      Browse verified master catalogs, filter architectural styles, and request live consultations.
    </p>
  </div>
  <div className="pt-4">
    <Button 
      variant="primary" 
      size="sm" 
      fullWidth 
      className="flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest uppercase text-white bg-black hover:bg-neutral-900"
      onClick={() => navigate('/designers')}
    >
      <Search size={12} /> Search Roster <ArrowRight size={12} />
    </Button>
  </div>
</Card>
      </div>

      {/* Live Appointments Action Feed Container */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <h3 className="text-xs uppercase tracking-widest font-bold text-black">Active Workspace Matrix</h3>
          <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-mono">Realtime Ledger</span>
        </div>

        <div className="space-y-4">
          {activeAppointments.map((apt) => (
            <Card key={apt.id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none luxury-hover grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-neutral-400 block">{apt.id}</span>
                <h4 className="text-sm font-luxury uppercase tracking-wider text-black">{apt.designerName}</h4>
                <span className="text-[10px] text-neutral-400 font-light italic block">{apt.serviceType}</span>
              </div>

              <div className="space-y-1 text-xs text-neutral-600 font-mono">
                <div className="flex items-center gap-1.5"><Calendar size={12} className="text-black" /> {apt.appointmentDate}</div>
                <div className="flex items-center gap-1.5"><Clock size={12} className="text-neutral-400" /> {apt.appointmentTime}</div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-light">
                <MapPin size={12} className="text-[#D4AF37] shrink-0" />
                <span className="truncate">{apt.location}</span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border ${
                  apt.status === 'accepted' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {apt.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};