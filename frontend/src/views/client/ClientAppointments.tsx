import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, XCircle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface AppointmentData {
  _id: string;
  clientId: string;
  designerId: {
    _id: string;
    userId: {
      name: string;
    } | null;
    location: string;
  } | null | string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes?: string;
  location: string;
  status: string;
}

export const ClientAppointments: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.get('http://localhost:5000/api/appointments/my', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      }
    } catch (err: any) {
      console.error('Error fetching deep appointment arrays:', err);
      setError(err.response?.data?.message || 'Failed to establish connection with secure auditing database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  // Sends cancellation reason down line to modify status state inside your MongoDB schema collection
  const handleCancelBooking = async (appointmentId: string) => {
    const confirmation = window.confirm("Are you sure you want to flag this appointment index as cancelled?");
    if (!confirmation) return;

    try {
      setActionLoading(appointmentId);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      // Adjust endpoint if your backend route maps to /api/appointments/cancel/:id or similar
      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/cancel`, 
        { cancellationReason: "Event postponed by user terminal request" },
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );

      if (response.data.success) {
        // Optimistically update status string locally matching database state change
        setAppointments(prev => 
          prev.map(apt => apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt)
        );
      }
    } catch (err: any) {
      console.error('Error dispatching cancellation pipeline event:', err);
      alert(err.response?.data?.message || 'Could not commit status update execution state.');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "TBD Schedule";
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return "TBD Schedule";
    }
  };

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen animate-fade-in">
      {/* Editorial Navigation Headers */}
      <div className="mb-12 border-b border-neutral-200/60 pb-6 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-2">
            Historical Auditing Ledger
          </span>
          <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
            Your Appointment Matrix
          </h1>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1">
          Total Records: {String(appointments.length).padStart(2, '0')}
        </span>
      </div>

      {/* Primary Context Logic Loops */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-white border border-neutral-200/60">
          <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
          <span>QUERYING TOTAL AUDIT LOG ARRAYS...</span>
        </div>
      ) : error ? (
        <div className="border border-rose-200 bg-rose-50/40 p-6 text-center max-w-xl mx-auto font-mono text-xs text-rose-900 tracking-wide flex items-center justify-center gap-2">
          <AlertCircle size={14} className="text-rose-600" />
          <span>{error}</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-16 text-center max-w-xl mx-auto rounded-none font-mono text-xs tracking-widest text-neutral-400">
          NO CURRENT REGISTERED CONSULTATION INDEXES DETECTED.
        </div>
      ) : (
        /* Dynamic Matrix Roster View Block */
        <div className="space-y-6">
          {appointments.map((apt) => {
            const isCanCancel = apt.status.toLowerCase() === 'pending' || apt.status.toLowerCase() === 'accepted';
            const designerName = typeof apt.designerId === 'object' && apt.designerId !== null
              ? (apt.designerId.userId?.name || 'Assigned Studio')
              : 'Atelier Studio';

            return (
              <div 
                key={apt._id} 
                className={`bg-white border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                  apt.status.toLowerCase() === 'cancelled' ? 'border-neutral-200/50 opacity-60' : 'border-neutral-200/90 hover:border-neutral-400'
                }`}
              >
                {/* ID Meta Block and Descriptions */}
                <div className="space-y-2 max-w-sm">
                  <span className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase block">
                    APT-{apt._id.slice(-6).toUpperCase()}
                  </span>
                  <h3 className="text-base font-luxury uppercase tracking-wider text-black">
                    {designerName}
                  </h3>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Scope // <span className="text-black font-bold">{apt.serviceType || 'Spatial Auditing'}</span>
                  </p>
                </div>

                {/* Logistics Clock Data Columns */}
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-neutral-400" />
                    <span>{formatDisplayDate(apt.appointmentDate)}</span>
                  </div>
                  <div>
                    <span>@ {apt.appointmentTime || 'TBD'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-400 uppercase tracking-wider">
                    <MapPin size={12} className="text-neutral-300" />
                    <span>{apt.location || 'Atelier Base'}</span>
                  </div>
                </div>

                {/* Operation Processing Control Row */}
                <div className="flex items-center gap-4 justify-between md:justify-end min-w-[200px]">
                  <span className={`inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border ${
                    apt.status.toLowerCase() === 'accepted' || apt.status.toLowerCase() === 'confirmed' ? 'bg-emerald-50/60 border-emerald-200 text-emerald-600' :
                    apt.status.toLowerCase() === 'pending' ? 'bg-amber-50/60 border-amber-200 text-amber-600' :
                    apt.status.toLowerCase() === 'cancelled' || apt.status.toLowerCase() === 'rejected' ? 'bg-rose-50/60 border-rose-200 text-rose-600' :
                    'bg-neutral-50 border-neutral-200 text-neutral-500'
                  }`}>
                    {apt.status}
                  </span>

                  {isCanCancel && (
                    <button
                      disabled={actionLoading === apt._id}
                      onClick={() => handleCancelBooking(apt._id)}
                      className="border border-rose-200 hover:border-rose-600 text-rose-600 hover:bg-rose-50/30 px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {actionLoading === apt._id ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        <XCircle size={11} />
                      )}
                      <span>Cancel Booking</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};