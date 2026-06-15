import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, User, Clock, CheckCircle2, XCircle, Loader2, AlertCircle, Inbox, CheckSquare } from 'lucide-react';

interface AppointmentData {
  _id: string;
  clientId: {
    name: string;
    email: string;
  } | null | any;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  notes?: string;
  contactPhone?: string;
  location: string;
  status: string;
}

export const DesignerDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const designerName = user?.name || "STUDIO ARCHITECT";

  const fetchDesignerMatrix = async () => {
    try {
      setLoading(true);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.get('http://localhost:5000/api/appointments/designer', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setAppointments(response.data.appointments || []);
      } else {
        setError('Failed to extract active studio booking records.');
      }
    } catch (err: any) {
      console.error('Error fetching designer studio arrays:', err);
      setError(err.response?.data?.message || 'Unable to sync with incoming project request pipelines.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignerMatrix();
  }, [token]);

  // Handles state updates for accept and reject routines
  const handleUpdateStatus = async (appointmentId: string, action: 'accept' | 'reject') => {
    const confirmAction = window.confirm(`Confirm action to ${action.toUpperCase()} this booking request?`);
    if (!confirmAction) return;

    try {
      setProcessingId(appointmentId);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );

      if (response.data.success) {
        const targetedStatus = action === 'accept' ? 'accepted' : 'rejected';
        setAppointments(prev =>
          prev.map(apt => apt._id === appointmentId ? { ...apt, status: targetedStatus } : apt)
        );
      }
    } catch (err: any) {
      console.error(`Error executing ${action} routine:`, err);
      alert(err.response?.data?.message || `Could not successfully execute the booking state transformation.`);
    } finally {
      setProcessingId(null);
    }
  };

  // NEW: Handles the project completion state routine matching PUT /api/appointments/:id/complete
  const handleCompleteProject = async (appointmentId: string) => {
    const confirmAction = window.confirm("Are you sure you want to log this space/consultation as officially COMPLETED?");
    if (!confirmAction) return;

    try {
      setProcessingId(appointmentId);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      const response = await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${activeToken}` } }
      );

      if (response.data.success) {
        setAppointments(prev =>
          prev.map(apt => apt._id === appointmentId ? { ...apt, status: 'completed' } : apt)
        );
      }
    } catch (err: any) {
      console.error('Error executing complete routine:', err);
      alert(err.response?.data?.message || 'Could not successfully mark appointment as completed.');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = appointments.filter(a => a.status.toLowerCase() === 'pending').length;
  const activeCommissions = appointments.filter(a => a.status.toLowerCase() === 'accepted' || a.status.toLowerCase() === 'confirmed').length;

  const formatDisplayDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isNaN(dateObj.getTime())) return "TBD";
      return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return "TBD";
    }
  };

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen animate-fade-in">
      <div className="mb-12 border-b border-neutral-200/60 pb-6">
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1 font-bold">
          <span>✦</span>
          <span>Studio Workspace Terminal // Authorized Access</span>
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
          {designerName} Overview
        </h1>
        <p className="text-xs font-mono text-neutral-400 mt-2 tracking-wide">
          Manage inbound design requests, scope specifications, and client consultation queues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-neutral-200/60 p-6 flex flex-col justify-between h-32">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
            Inbound Review Queue
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-luxury tracking-wider text-black">
              {String(pendingRequests).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-mono text-amber-500 tracking-wider uppercase font-bold">
              Pending Validation
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/60 p-6 flex flex-col justify-between h-32">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
            Active Spatial Commissions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-luxury tracking-wider text-black">
              {String(activeCommissions).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-mono text-emerald-600 tracking-wider uppercase font-bold">
              Cleared Rooms
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-luxury uppercase tracking-widest text-black font-bold">
          Inbound Project Matrix Ledger
        </h2>
        <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
          Live Operational Stream
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-white border border-neutral-200/60">
          <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
          <span>SYNCHRONIZING ATELIER COMMAND LINES...</span>
        </div>
      ) : error ? (
        <div className="border border-rose-200 bg-rose-50/40 p-6 text-center rounded-none font-mono text-xs text-rose-900 tracking-wide flex items-center justify-center gap-2">
          <AlertCircle size={14} className="text-rose-600" />
          <span>{error}</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-16 text-center rounded-none font-mono text-xs tracking-widest text-neutral-400 max-w-2xl mx-auto flex flex-col items-center gap-2">
          <Inbox size={24} className="text-neutral-300" />
          <span>NO APPOINTMENT TRANSMISSIONS COMMITTED TO THIS ATELIER ID.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const clientDisplayName = apt.clientId && typeof apt.clientId === 'object'
              ? apt.clientId.name
              : 'Registered Client';
              
            const currentStatus = apt.status.toLowerCase();
            const isPending = currentStatus === 'pending';
            const isActive = currentStatus === 'accepted' || currentStatus === 'confirmed';

            return (
              <div 
                key={apt._id} 
                className={`bg-white border p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all ${
                  currentStatus === 'cancelled' || currentStatus === 'rejected' ? 'border-neutral-200/40 opacity-50' : 'border-neutral-200/80 hover:border-neutral-400'
                }`}
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase block">
                    REF ID: {apt._id.slice(-6).toUpperCase()}
                  </span>
                  <h3 className="text-base font-luxury uppercase tracking-wider text-black">
                    Scope: {apt.serviceType || 'Spatial Blueprint Architecture'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <User size={12} className="text-neutral-400" />
                    <span className="font-mono text-[11px]">Client: <span className="text-black font-bold uppercase">{clientDisplayName}</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-[11px] text-neutral-500 min-w-[240px]">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-neutral-400" />
                    <span>{formatDisplayDate(apt.appointmentDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-neutral-400" />
                    <span>{apt.appointmentTime || 'TBD'}</span>
                  </div>
                  <span className="col-span-2 text-[10px] text-neutral-400 italic mt-1 truncate max-w-xs">
                    Notes: "{apt.notes || 'No special conditions logged.'}"
                  </span>
                </div>

                <div className="flex items-center gap-3 justify-end min-w-[180px]">
                  {/* Option Set A: Request is waiting for validation */}
                  {isPending && (
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                      <button
                        disabled={processingId === apt._id}
                        onClick={() => handleUpdateStatus(apt._id, 'accept')}
                        className="flex-1 lg:flex-initial bg-black text-white hover:bg-neutral-900 text-[10px] font-mono tracking-widest uppercase px-3 py-2 flex items-center gap-1 transition-all"
                      >
                        <CheckCircle2 size={12} className="text-[#D4AF37]" />
                        <span>Accept</span>
                      </button>
                      <button
                        disabled={processingId === apt._id}
                        onClick={() => handleUpdateStatus(apt._id, 'reject')}
                        className="flex-1 lg:flex-initial border border-neutral-200 hover:border-rose-600 hover:text-rose-600 text-[10px] font-mono tracking-widest uppercase px-3 py-2 flex items-center gap-1 transition-all"
                      >
                        <XCircle size={12} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}

                  {/* Option Set B: Request was accepted and can now be marked complete */}
                  {isActive && (
                    <button
                      disabled={processingId === apt._id}
                      onClick={() => handleCompleteProject(apt._id)}
                      className="w-full lg:w-auto border border-emerald-600 text-emerald-600 hover:bg-emerald-50/40 text-[10px] font-mono tracking-widest uppercase px-4 py-2 flex items-center justify-center gap-1.5 transition-all font-bold"
                    >
                      <CheckSquare size={12} />
                      <span>Mark as Completed</span>
                    </button>
                  )}

                  {/* Option Set C: Terminal state achieved (Completed, Cancelled, Rejected) */}
                  {!isPending && !isActive && (
                    <span className={`inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border ${
                      currentStatus === 'completed' ? 'bg-emerald-600 border-emerald-600 text-white' :
                      'bg-neutral-50 border-neutral-200 text-neutral-500'
                    }`}>
                      {apt.status}
                    </span>
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