import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

export const DesignerAppointments: React.FC = () => {
  const [bookings, setBookings] = useState([
    { id: 'APT-902', client: 'John Doe', date: '2026-10-25', time: '10:00 AM', serviceType: 'Consultation', status: 'accepted', location: 'Milan Studio Suite 4', notes: 'Looking for living room redesign' },
    { id: 'APT-741', client: 'Sarah Connor', date: '2026-11-02', time: '02:30 PM', serviceType: 'Spatial Auditing', status: 'pending', location: 'Client Address, Penthouse B', notes: 'Bespoke marble layout analysis' }
  ]);

  const updateStatus = (id: string, newStatus: 'accepted' | 'rejected' | 'completed' | 'cancelled') => {
    setBookings(prev => prev.map(book => book.id === id ? { ...book, status: newStatus } : book));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Bookings Manager</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Control client appointments lifecycle matrices</p>
      </div>

      <div className="space-y-4">
        {bookings.map((book) => (
          <Card key={book.id} className="p-0 overflow-hidden bg-white">
            <div className="px-6 py-3 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-2 bg-neutral-50/50">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{book.id} • {book.serviceType}</span>
              <span className={`text-[9px] tracking-widest uppercase font-bold px-3 py-0.5 border ${
                book.status === 'accepted' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                book.status === 'pending' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                book.status === 'completed' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                'border-neutral-200 text-neutral-400 bg-neutral-100'
              }`}>
                {book.status}
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase block">Client Name</span>
                <h4 className="text-sm font-semibold uppercase text-black tracking-wide">{book.client}</h4>
                <p className="text-xs font-light italic text-neutral-500 mt-1">"{book.notes}"</p>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 uppercase tracking-wider font-light">
                <div className="flex items-center gap-2"><Clock size={12} /> {book.date} @ {book.time}</div>
                <div className="flex items-center gap-2"><MapPin size={12} /> {book.location}</div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {book.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(book.id, 'accepted')} className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold tracking-widest hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">Accept</button>
                    <button onClick={() => updateStatus(book.id, 'rejected')} className="px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 text-[10px] uppercase font-bold tracking-widest hover:bg-red-600 hover:text-white transition-all cursor-pointer">Decline</button>
                  </>
                )}
                {book.status === 'accepted' && (
                  <>
                    <button onClick={() => updateStatus(book.id, 'completed')} className="px-3 py-1.5 border border-blue-200 bg-blue-50 text-blue-700 text-[10px] uppercase font-bold tracking-widest hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"><CheckCircle size={12} /> Mark Complete</button>
                    <button onClick={() => updateStatus(book.id, 'cancelled')} className="px-3 py-1.5 border border-neutral-200 bg-neutral-50 text-neutral-500 text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-600 hover:text-white transition-all cursor-pointer flex items-center gap-1"><XCircle size={12} /> Cancel</button>
                  </>
                )}
                {['completed', 'cancelled', 'rejected'].includes(book.status) && (
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Archived Schedule</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};