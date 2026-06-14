import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { CalendarX, Clock, MapPin, Phone } from 'lucide-react';

export const ClientAppointments: React.FC = () => {
  // Matching backend schema status values: "pending", "accepted", "rejected", "completed", "cancelled"
  const [appointments, setAppointments] = useState([
    { id: '1', designerName: 'Eleanor Vance', date: '2026-10-25', time: '10:00 AM', serviceType: 'Consultation', status: 'accepted', location: 'Milan Studio Suite 4', phone: '+123456789', notes: 'Looking for living room redesign' },
    { id: '2', designerName: 'Atelier Maurice', date: '2026-11-02', time: '02:30 PM', serviceType: 'Spatial Auditing', status: 'pending', location: 'Client Address, Penthouse B', phone: '+987654321', notes: 'Bespoke marble layout analysis' }
  ]);

  const handleCancelAppointment = (id: string) => {
    // Phase 2 UI state transition to simulate backend response action
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Reserved Windows</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Track and update consultation schedules</p>
      </div>

      <div className="space-y-6">
        {appointments.map((apt) => (
          <Card key={apt.id} className="p-0 overflow-hidden bg-white">
            {/* Appointment Header Metadata Section */}
            <div className="px-6 py-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2 bg-neutral-50/50">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-mono uppercase font-bold text-neutral-400">ID: {apt.id}</span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#D4AF37]">{apt.serviceType}</span>
              </div>
              
              <span className={`text-[9px] tracking-widest uppercase font-bold px-3 py-1 border ${
                apt.status === 'accepted' ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50' :
                apt.status === 'pending' ? 'border-amber-200 text-amber-700 bg-amber-50/50' :
                'border-neutral-200 text-neutral-400 bg-neutral-100'
              }`}>
                {apt.status}
              </span>
            </div>

            {/* Main Content Info Block */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase block font-medium">Selected Designer</span>
                <h3 className="text-lg font-luxury text-black uppercase tracking-wide">{apt.designerName}</h3>
                <p className="text-xs text-neutral-500 italic font-light pt-1">"{apt.notes}"</p>
              </div>

              {/* Time and Logistics */}
              <div className="space-y-2 text-xs text-neutral-600 uppercase tracking-wider font-light">
                <div className="flex items-center gap-2"><Clock size={12} className="text-black" /> {apt.date} @ {apt.time}</div>
                <div className="flex items-center gap-2"><MapPin size={12} className="text-black" /> {apt.location}</div>
                <div className="flex items-center gap-2"><Phone size={12} className="text-black" /> {apt.phone}</div>
              </div>

              {/* Functional Actions */}
              <div className="flex justify-end">
                {apt.status !== 'cancelled' && apt.status !== 'completed' && apt.status !== 'rejected' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-red-200/60 text-red-600 hover:bg-red-50 hover:border-red-500/40 text-[10px]"
                    onClick={() => handleCancelAppointment(apt.id)}
                  >
                    <CalendarX size={12} className="mr-1.5" /> Cancel Booking Window
                  </Button>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">No further actions available</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};