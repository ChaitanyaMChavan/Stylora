import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/card';
import { Calendar, User, Clock, Loader2 } from 'lucide-react';

export const AdminAppointments: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const activeToken = token || localStorage.getItem('stylora_auth_token');
        const response = await axios.get('http://localhost:5000/api/admin/appointments', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });
        if (response.data.success) {
          setAppointments(response.data.appointments || []);
        }
      } catch (err) {
        console.error(err);
      } {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 font-mono text-xs text-neutral-400">
        <Loader2 className="animate-spin text-[#D4AF37] mr-2" size={16} /> DATA AUDIT STREAMING OPENED...
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Cross-Network Audit Trail</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">System Appointments Master Log</h1>
      </div>

      <div className="space-y-4">
        {appointments.map((log) => {
          const clientName = log.clientId?.name || 'Unregistered Client';
          const designerName = log.designerId?.name || 'Atelier Assignment Drop';
          
          return (
            <Card key={log._id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-400 block">APT-{log._id.slice(-6).toUpperCase()}</span>
                <div className="flex items-center gap-1.5 text-black">
                  <User size={12} className="text-[#D4AF37]" /> 
                  <span className="uppercase font-bold">{clientName}</span>
                </div>
                <div className="text-[10px] text-neutral-400">Targeting: {designerName}</div>
              </div>

              <div className="space-y-1 text-neutral-600">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} /> {new Date(log.appointmentDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} /> {log.appointmentTime}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">Scope Context Type</span>
                <span className="text-neutral-600 text-[11px] font-bold uppercase">{log.serviceType || 'Spatial consultation'}</span>
              </div>

              <div className="flex justify-end items-center gap-3">
                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 border ${
                  log.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  log.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                }`}>
                  {log.status}
                </span>
                {log.paymentStatus === 'paid' && (
                  <span className="text-[9px] bg-black text-white font-bold uppercase tracking-widest px-2 py-1">PAID</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};