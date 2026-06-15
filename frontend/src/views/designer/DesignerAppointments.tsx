import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  Loader2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Check, 
  X, 
  MessageSquare, 
  Inbox, 
  AlertCircle 
} from 'lucide-react';

interface AppointmentRequest {
  _id: string;
  clientId: string | { name: string; email: string };
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  location: string;
  contactPhone: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

export const DesignerAppointments: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch all incoming appointments for this logged-in designer
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.get('http://localhost:5000/api/appointments/designer', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        // Handle variations in api payload formatting
        setRequests(response.data.appointments || response.data.data || []);
      }
    } catch (err: any) {
      console.error("Failed to compile incoming consultation matrices:", err);
      setErrorMessage("Could not load appointment requests. Ensure server pipelines are online.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  // Handle Accept Pipeline Action
  const handleAccept = async (id: string) => {
    try {
      setActioningId(id);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.put(`http://localhost:5000/api/appointments/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        // Optimistically update status locally in UI array state
        setRequests(prev => 
          prev.map(req => req._id === id ? { ...req, status: 'accepted' } : req)
        );
      }
    } catch (err: any) {
      console.error("Accept operation dropped by gatekeeper:", err);
      alert(err.response?.data?.message || "Failed to accept appointment.");
    } finally {
      setActioningId(null);
    }
  };

  // Handle Reject Pipeline Action
  const handleReject = async (id: string) => {
    if (!window.confirm("Are you sure you want to decline this consultation request?")) return;
    
    try {
      setActioningId(id);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.put(`http://localhost:5000/api/appointment/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setRequests(prev => 
          prev.map(req => req._id === id ? { ...req, status: 'rejected' } : req)
        );
      }
    } catch (err: any) {
      console.error("Reject operation dropped by gatekeeper:", err);
      alert(err.response?.data?.message || "Failed to reject appointment.");
    } finally {
      setActioningId(null);
    }
  };

  // Helper helper function to return status badge stylings
  const getStatusBadge = (status: string) => {
    const base = "px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider font-bold border rounded-none ";
    switch (status) {
      case 'pending':
        return base + "bg-amber-50 text-amber-700 border-amber-200";
      case 'accepted':
        return base + "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 'rejected':
        return base + "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return base + "bg-neutral-50 text-neutral-600 border-neutral-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-[#FAFAFA] min-h-screen">
        <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
        <span>COMPILING ALL INCOMING CONSULTATION REQUESTS...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Structural Minimal Header Panel */}
      <div className="border-b border-neutral-200 pb-5">
        <div className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1">✦ Studio Control Platform</div>
        <h1 className="text-2xl font-luxury uppercase tracking-wider text-black">Consultation Request Console</h1>
        <p className="text-xs font-mono text-neutral-400 mt-1">Manage client allocation requests, parameters, and design scopes.</p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 font-mono text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle size={14} />
          {errorMessage}
        </div>
      )}

      {/* Grid Dashboard Lists Render */}
      {requests.length === 0 ? (
        <div className="border border-neutral-200 border-dashed bg-white p-20 text-center flex flex-col items-center justify-center gap-3 text-neutral-400 font-mono text-xs tracking-wider">
          <Inbox size={28} className="text-neutral-300 stroke-1" />
          <span>NO INCOMING ATELIER BOOKINGS REGISTERED YET.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {requests.map((req) => {
            const isPending = req.status === 'pending';
            const clientName = typeof req.clientId === 'object' ? req.clientId.name : 'Premium Stylora Client';
            const clientEmail = typeof req.clientId === 'object' ? req.clientId.email : '';

            return (
              <div 
                key={req._id} 
                className={`bg-white border transition-all shadow-sm ${
                  isPending ? 'border-neutral-200 hover:border-neutral-400' : 'border-neutral-200 opacity-80'
                }`}
              >
                {/* Upper Status Title Block */}
                <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-[#FAFAFA]/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-none flex items-center justify-center text-white font-mono text-xs font-bold uppercase">
                      {clientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-black uppercase tracking-wide">{clientName}</h3>
                      {clientEmail && <p className="text-[10px] font-mono text-neutral-400">{clientEmail}</p>}
                    </div>
                  </div>
                  <span className={getStatusBadge(req.status)}>{req.status}</span>
                </div>

                {/* Core Allocation Parameters Matrix Body */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-neutral-50 text-xs font-mono">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Calendar size={13} className="text-[#D4AF37]" />
                      <span>DATE: <strong className="text-black">{new Date(req.appointmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Clock size={13} className="text-[#D4AF37]" />
                      <span>TIME: <strong className="text-black">{req.appointmentTime}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <User size={13} className="text-[#D4AF37]" />
                      <span>SERVICE: <strong className="text-black uppercase text-[11px]">{req.serviceType}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <MapPin size={13} className="text-[#D4AF37]" />
                      <span className="truncate">SITE: <strong className="text-black uppercase">{req.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Phone size={13} className="text-[#D4AF37]" />
                      <span>PHONE: <strong className="text-black">{req.contactPhone}</strong></span>
                    </div>
                  </div>

                </div>

                {/* Client Narrative Notes Brief Block */}
                <div className="p-5 bg-[#FAFAFA]/30 border-b border-neutral-100 space-y-1.5">
                  <h4 className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-bold flex items-center gap-1.5">
                    <MessageSquare size={11} /> Project Brief Requirements
                  </h4>
                  <p className="text-xs font-light text-neutral-600 italic leading-relaxed pl-4">
                    "{req.notes || 'No operational layout dependencies specified by client.'}"
                  </p>
                </div>

                {/* Lower Decision Making Control Bar */}
                <div className="p-4 bg-white flex items-center justify-end gap-3 min-h-[60px]">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleReject(req._id)}
                        disabled={actioningId !== null}
                        className="px-4 py-2 border border-neutral-200 text-neutral-500 hover:text-rose-600 hover:border-rose-300 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-40"
                      >
                        <X size={12} /> Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req._id)}
                        disabled={actioningId !== null}
                        className="px-5 py-2 bg-black text-white hover:bg-neutral-900 font-mono text-[11px] uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
                      >
                        {actioningId === req._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Check size={12} className="text-[#D4AF37]" />
                        )}
                        Accept Order
                      </button>
                    </>
                  ) : (
                    <div className="text-[10px] font-mono text-neutral-400 uppercase italic tracking-wider">
                      Decision committed on this consultation file.
                    </div>
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