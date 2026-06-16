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
  AlertCircle,
  CheckCircle2,
  AlertTriangle
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

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface ConfirmationModalState {
  show: boolean;
  appointmentId: string | null;
  action: 'accept' | 'reject' | null;
  title: string;
  message: string;
}

export const DesignerAppointments: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalState>({
    show: false,
    appointmentId: null,
    action: null,
    title: '',
    message: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

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

  const openConfirmation = (appointmentId: string, action: 'accept' | 'reject') => {
    if (action === 'accept') {
      setConfirmModal({
        show: true,
        appointmentId,
        action: 'accept',
        title: 'Accept Consultation Request',
        message: 'Are you sure you want to approve this client consultation request? Doing so will log this into your active commissions ledger.'
      });
    } else {
      setConfirmModal({
        show: true,
        appointmentId,
        action: 'reject',
        title: 'Decline Consultation Request',
        message: 'Are you sure you want to decline this consultation request? This operation cannot be reversed.'
      });
    }
  };

  const closeConfirmation = () => {
    setConfirmModal({ show: false, appointmentId: null, action: null, title: '', message: '' });
  };

  const handleConfirmedAction = () => {
    const { appointmentId, action } = confirmModal;
    if (!appointmentId || !action) return;

    closeConfirmation();
    if (action === 'accept') {
      executeAccept(appointmentId);
    } else if (action === 'reject') {
      executeReject(appointmentId);
    }
  };

  // Handle Accept Pipeline Action
  const executeAccept = async (id: string) => {
    try {
      setActioningId(id);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.put(`http://localhost:5000/api/appointments/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        showToast("Appointment request accepted successfully.", "success");
        // Optimistically update status locally in UI array state
        setRequests(prev => 
          prev.map(req => req._id === id ? { ...req, status: 'accepted' } : req)
        );
      }
    } catch (err: any) {
      console.error("Accept operation dropped by gatekeeper:", err);
      showToast(err.response?.data?.message || "Failed to accept appointment.", "error");
    } finally {
      setActioningId(null);
    }
  };

  // Handle Reject Pipeline Action
  const executeReject = async (id: string) => {
    try {
      setActioningId(id);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      const response = await axios.put(`http://localhost:5000/api/appointment/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        showToast("Appointment request declined successfully.", "success");
        setRequests(prev => 
          prev.map(req => req._id === id ? { ...req, status: 'rejected' } : req)
        );
      }
    } catch (err: any) {
      console.error("Reject operation dropped by gatekeeper:", err);
      showToast(err.response?.data?.message || "Failed to reject appointment.", "error");
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
                        onClick={() => openConfirmation(req._id, 'reject')}
                        disabled={actioningId !== null}
                        className="px-4 py-2 border border-neutral-200 text-neutral-500 hover:text-rose-600 hover:border-rose-300 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-40"
                      >
                        <X size={12} /> Decline
                      </button>
                      <button
                        onClick={() => openConfirmation(req._id, 'accept')}
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

      {/* CUSTOM ACTION CONFIRMATION MODAL OVERLAY */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-md p-6 animate-scale-up animate-fade-in">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-4">
              <AlertTriangle size={16} className={confirmModal.action === 'reject' ? 'text-rose-500' : 'text-[#D4AF37]'} />
              <h2 className="text-sm font-mono uppercase font-bold tracking-widest text-black">
                {confirmModal.title}
              </h2>
            </div>
            <p className="text-xs font-mono text-neutral-500 tracking-wide leading-relaxed mb-6">
              {confirmModal.message}
            </p>
            <div className="flex justify-end gap-3 font-mono text-[10px] tracking-widest uppercase">
              <button 
                onClick={closeConfirmation}
                className="border border-neutral-200 hover:border-black text-neutral-500 hover:text-black px-4 py-2 transition-all"
              >
                Go Back
              </button>
              <button 
                onClick={handleConfirmedAction}
                className={`px-4 py-2 text-white transition-all ${
                  confirmModal.action === 'reject' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-black hover:bg-neutral-800'
                }`}
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC NOTIFICATION TOAST OVERLAY PANEL */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 border font-mono text-xs tracking-wider transition-all shadow-md max-w-sm ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
          <span>{toast.message.toUpperCase()}</span>
        </div>
      )}
    </div>
  );
};