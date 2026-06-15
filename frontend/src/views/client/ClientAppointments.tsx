import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Calendar, MapPin, XCircle, Loader2, AlertCircle, CreditCard, CheckCircle2, AlertTriangle } from 'lucide-react';

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
  paymentStatus?: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface ConfirmationModalState {
  show: boolean;
  appointmentId: string | null;
  type: 'cancel' | 'pay' | null;
  title: string;
  message: string;
}

export const ClientAppointments: React.FC = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Custom UI Component State overlays to replace native window components
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [confirmModal, setConfirmModal] = useState<ConfirmationModalState>({
    show: false,
    appointmentId: null,
    type: null,
    title: '',
    message: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

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

  // Trigger UI confirmation panel layout instead of window.confirm
  const openConfirmation = (appointmentId: string, type: 'cancel' | 'pay') => {
    if (type === 'cancel') {
      setConfirmModal({
        show: true,
        appointmentId,
        type: 'cancel',
        title: 'Cancel Consultation',
        message: 'Are you sure you want to flag this appointment allocation as cancelled? This operation cannot be reversed.'
      });
    } else if (type === 'pay') {
      setConfirmModal({
        show: true,
        appointmentId,
        type: 'pay',
        title: 'Authorize Payment Process',
        message: 'This action will automatically allocate the standard base consultation fee baseline of ₹500.00 from your account wallet.'
      });
    }
  };

  const closeConfirmation = () => {
    setConfirmModal({ show: false, appointmentId: null, type: null, title: '', message: '' });
  };

  // Execution pipelines triggered when confirming from the custom UI modal
  const handleConfirmedAction = async () => {
    const { appointmentId, type } = confirmModal;
    if (!appointmentId || !type) return;

    closeConfirmation();

    if (type === 'pay') {
      try {
        setActionLoading(appointmentId);
        const activeToken = token || localStorage.getItem('stylora_auth_token');

        const response = await axios.put(
          `http://localhost:5000/api/appointments/${appointmentId}/pay`, 
          { amount: 500 }, // Automatically processes a fixed standard consultation fee baseline
          { headers: { Authorization: `Bearer ${activeToken}` } }
        );

        if (response.data.success) {
          showToast("Payment baseline authorized and applied successfully.", "success");
          setAppointments(prev => 
            prev.map(apt => apt._id === appointmentId ? { ...apt, paymentStatus: 'paid' } : apt)
          );
        }
      } catch (err: any) {
        console.error('Error dispatching payment pipeline event:', err);
        showToast(err.response?.data?.message || 'Could not complete payment execution step.', "error");
      } finally {
        setActionLoading(null);
      }
    } else if (type === 'cancel') {
      try {
        setActionLoading(appointmentId);
        const activeToken = token || localStorage.getItem('stylora_auth_token');

        const response = await axios.put(
          `http://localhost:5000/api/appointments/${appointmentId}/cancel`, 
          { cancellationReason: "Event postponed by user terminal request" },
          { headers: { Authorization: `Bearer ${activeToken}` } }
        );

        if (response.data.success) {
          showToast("Appointment successfully marked as cancelled.", "success");
          setAppointments(prev => 
            prev.map(apt => apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt)
          );
        }
      } catch (err: any) {
        console.error('Error dispatching cancellation pipeline event:', err);
        showToast(err.response?.data?.message || 'Could not commit status update execution state.', "error");
      } finally {
        setActionLoading(null);
      }
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
    <div className="p-8 bg-[#FAFAFA] min-h-screen relative animate-fade-in">
      
      {/* 1. DYNAMIC NOTIFICATION TOAST OVERLAY PANEL */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 border font-mono text-xs tracking-wider transition-all shadow-md max-w-sm ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
          <span>{toast.message.toUpperCase()}</span>
        </div>
      )}

      {/* 2. CUSTOM ACTION CONFIRMATION MODAL OVERLAY */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 w-full max-w-md p-6 animate-scale-up">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-4">
              <AlertTriangle size={16} className={confirmModal.type === 'cancel' ? 'text-rose-500' : 'text-[#D4AF37]'} />
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
                  confirmModal.type === 'cancel' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-black hover:bg-neutral-800'
                }`}
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

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
        <div className="space-y-6">
          {appointments.map((apt) => {
            const isCanCancel = apt.status.toLowerCase() === 'pending' || apt.status.toLowerCase() === 'accepted';
            const designerName = typeof apt.designerId === 'object' && apt.designerId !== null
              ? (apt.designerId.userId?.name || 'Assigned Studio')
              : 'Atelier Studio';

            const isEligibleToPay = apt.status.toLowerCase() === 'accepted' && apt.paymentStatus?.toLowerCase() !== 'paid';

            return (
              <div 
                key={apt._id} 
                className={`bg-white border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                  apt.status.toLowerCase() === 'cancelled' ? 'border-neutral-200/50 opacity-60' : 'border-neutral-200/90 hover:border-neutral-400'
                }`}
              >
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

                <div className="flex flex-wrap items-center gap-3 justify-between md:justify-end min-w-[280px]">
                  <span className={`inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border ${
                    apt.status.toLowerCase() === 'accepted' || apt.status.toLowerCase() === 'confirmed' ? 'bg-emerald-50/60 border-emerald-200 text-emerald-600' :
                    apt.status.toLowerCase() === 'pending' ? 'bg-amber-50/60 border-amber-200 text-amber-600' :
                    apt.status.toLowerCase() === 'cancelled' || apt.status.toLowerCase() === 'rejected' ? 'bg-rose-50/60 border-rose-200 text-rose-600' :
                    'bg-neutral-50 border-neutral-200 text-neutral-500'
                  }`}>
                    {apt.status}
                    {apt.paymentStatus?.toLowerCase() === 'paid' && " (PAID)"}
                  </span>

                  {/* PROCEED TO PAYMENT BUTTON ELEMENT */}
                  {isEligibleToPay && (
                    <button
                      disabled={actionLoading === apt._id}
                      onClick={() => openConfirmation(apt._id, 'pay')}
                      className="bg-black hover:bg-neutral-800 text-white border border-black px-3 py-1.5 text-[9px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 disabled:opacity-40"
                    >
                      {actionLoading === apt._id ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        <CreditCard size={11} />
                      )}
                      <span>Proceed to Payment</span>
                    </button>
                  )}

                  {isCanCancel && (
                    <button
                      disabled={actionLoading === apt._id}
                      onClick={() => openConfirmation(apt._id, 'cancel')}
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