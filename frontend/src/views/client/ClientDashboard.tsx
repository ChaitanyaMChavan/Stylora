import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, Search, Loader2, MapPin, AlertCircle } from 'lucide-react';

// Exact match with your Mongoose schema fields seen in MongoDB Compass
interface AppointmentData {
  _id: string;
  clientId: string;
  designerId: {
    _id: string;
    userId: {
      name: string;
    } | null;
    location: string;
  } | null | string; // Accommodates both populated objects and raw IDs
  appointmentDate: string; 
  appointmentTime: string; 
  serviceType: string;     
  notes?: string;
  contactPhone?: string;
  location: string;        
  status: string;          
  cancellationReason?: string;
}

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const savedUser = localStorage.getItem('stylora_user_payload');
  const clientName = user?.name || (savedUser ? JSON.parse(savedUser).name : 'CLIENT');

  useEffect(() => {
    const fetchDashboardMatrix = async () => {
      try {
        setLoading(true);
        const activeToken = token || localStorage.getItem('stylora_auth_token');
        
        const response = await axios.get('http://localhost:5000/api/appointments/my', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });

        if (response.data.success) {
          setAppointments(response.data.appointments || []);
        } else {
          setError('Failed to securely synchronize appointment ledger streams.');
        }
      } catch (err: any) {
        console.error('Error reading client dashboard parameters:', err);
        setError(err.response?.data?.message || 'Unable to establish connection with the booking database.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMatrix();
  }, [token]);

  // Derive telemetry counts dynamically from your real database array values
  const totalDispatchedBriefs = appointments.length;
  const verifiedAtelierClearances = appointments.filter(
    apt => apt.status.toUpperCase() === 'ACCEPTED' || apt.status.toUpperCase() === 'CONFIRMED'
  ).length;

  // Helper safely handling MongoDB dates to prevent "Invalid Date" crashes
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
      {/* Editorial Header Section */}
      <div className="mb-12 border-b border-neutral-200/60 pb-6">
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1 font-bold">
          <span>✦</span>
          <span>Client Session Terminal // Active</span>
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
          Welcome back, {clientName}
        </h1>
        <p className="text-xs font-mono text-neutral-400 mt-2 tracking-wide">
          Monitor your private blueprints, active consultation pipelines, and design studio streams.
        </p>
      </div>

      {/* Dynamic Telemetry Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-neutral-200/60 p-6 flex flex-col justify-between h-36">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
            Total Dispatched Briefs
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-luxury tracking-wider text-black">
              {String(totalDispatchedBriefs).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-mono text-emerald-600 tracking-wider uppercase font-bold">
              Active Stream
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/60 p-6 flex flex-col justify-between h-36">
          <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
            Verified Atelier Clearances
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-luxury tracking-wider text-black">
              {String(verifiedAtelierClearances).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-mono text-amber-500 tracking-wider uppercase font-bold">
              Confirmed Room
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/60 p-6 flex flex-col justify-between h-36">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] font-bold">
            Marketplace Engine
          </span>
          <div>
            <h4 className="text-sm font-luxury uppercase tracking-wider text-black mb-1">
              Commission New Spaces
            </h4>
            <p className="text-[10px] font-mono text-neutral-400 mb-3 tracking-wide lowercase">
              Browse verified master catalogs & request live consultations.
            </p>
          </div>
          <button 
            onClick={() => navigate('/designers')}
            className="w-full border border-black bg-black text-white py-2 text-[10px] font-mono tracking-widest uppercase hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 rounded-none"
          >
            <Search size={11} />
            <span>Search Roster</span>
          </button>
        </div>
      </div>

      {/* Active Workspace Matrix Sub-Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-luxury uppercase tracking-widest text-black font-bold">
          Active Workspace Matrix
        </h2>
        <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
          Realtime Ledger
        </span>
      </div>

      {/* Rendering State Conditional Block */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-white border border-neutral-200/60">
          <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
          <span>SYNCHRONIZING SECURE BOOKING MATRIX...</span>
        </div>
      ) : error ? (
        <div className="border border-rose-200 bg-rose-50/40 p-6 text-center rounded-none font-mono text-xs text-rose-900 tracking-wide flex items-center justify-center gap-2">
          <AlertCircle size={14} className="text-rose-600" />
          <span>{error}</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-12 text-center rounded-none font-mono text-xs tracking-widest text-neutral-400">
          NO DISPATCHED CONSULTATION RECORDS DETECTED IN LOGS.
        </div>
      ) : (
        /* Dynamic Mapping over your real Mongoose model payload values */
        <div className="space-y-4">
          {appointments.map((apt) => {
            // Safely resolve the designer's display name if it was populated by the backend route
            const designerName = typeof apt.designerId === 'object' && apt.designerId !== null
              ? (apt.designerId.userId?.name || 'Assigned Studio')
              : 'Atelier Studio';

            return (
              <div 
                key={apt._id} 
                className="bg-white border border-neutral-200/70 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-400 transition-all"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase block">
                    ID: {apt._id.slice(-6).toUpperCase()}
                  </span>
                  <h3 className="text-base font-luxury uppercase tracking-wider text-black">
                    {designerName}
                  </h3>
                  <p className="text-[10px] font-mono text-[#D4AF37] font-bold tracking-wide uppercase">
                    ↳ Scope: {apt.serviceType || 'General Consultation'}
                  </p>
                </div>

                {/* Time and Date Columns */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-neutral-500">
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

                {/* Status Badges handling uppercase transformations cleanly */}
                <div>
                  <span className={`inline-block px-3 py-1 text-[9px] font-mono font-bold tracking-widest uppercase border ${
                    apt.status.toUpperCase() === 'ACCEPTED' || apt.status.toUpperCase() === 'CONFIRMED' ? 'bg-emerald-50/60 border-emerald-200 text-emerald-600' :
                    apt.status.toUpperCase() === 'PENDING' ? 'bg-amber-50/60 border-amber-200 text-amber-600' :
                    apt.status.toUpperCase() === 'CANCELLED' || apt.status.toUpperCase() === 'REJECTED' ? 'bg-rose-50/60 border-rose-200 text-rose-600' :
                    'bg-neutral-50 border-neutral-200 text-neutral-500'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};