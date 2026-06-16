import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, MapPin, Award, Calendar, Clock, MessageSquare, Layers, Sparkles, CheckCircle, X } from 'lucide-react';


interface DesignerProfile {
  _id: string;
  userId: string | { name: string; email: string };
  bio: string;
  location: string;
  experience: number;
  phone: string;
  specialization?: string;
  style?: string;
  baseRate?: number;
  profileImage?: string;
}

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  priceRange?: string;
  category?: string;
}

export const DesignerProfile: React.FC = () => {
  const { id: designerId } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Core Data States
  const [designer, setDesigner] = useState<DesignerProfile | null>(null);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [serviceType, setServiceType] = useState<string>('Consultation');
  const [contactPhone, setContactPhone] = useState<string>('');

  // Modal & Appointment Form States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [consultationLocation, setConsultationLocation] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'pending_confirmed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const fetchAtelierData = async () => {
      try {
        setLoading(true);
        const activeToken = token || localStorage.getItem('stylora_auth_token');
        const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : {};

        // 1. Fetch the basic public designer profile information
        const profileRes = await axios.get(`http://localhost:5000/api/designers/profile/${designerId}`, { headers });
        if (profileRes.data.success) {
          setDesigner(profileRes.data.profile);
        }

        // 2. FETCH MISSED PORTFOLIOS: Connects to your public route: /api/portfolio/designer/:id
        try {
          const portfolioRes = await axios.get(`http://localhost:5000/api/portfolio/designer/${designerId}`, { headers });
          if (portfolioRes.data.success) {
            setPortfolios(portfolioRes.data.portfolios || portfolioRes.data.data || []);
          }
        } catch (pErr) {
          console.warn("No active showcase portfolio items linked to this designer ID asset:", pErr);
          setPortfolios([]);
        }

      } catch (err: any) {
        console.error("Critical error mapping profile metrics:", err);
        setErrorMessage("Unable to unpack authorized studio manifests.");
      } finally {
        setLoading(false);
      }
    };

    if (designerId) {
      fetchAtelierData();
    }
  }, [designerId, token]);

  // Handle Booking Submission
// Handle Booking Submission
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setBookingStatus('submitting');
      setErrorMessage('');
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      if (!activeToken) {
        setErrorMessage("Authentication token lost. Please log back in.");
        return;
      }

      // Enforce contact phone number is exactly 10 digits
      const cleanedPhone = contactPhone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        setErrorMessage("Contact phone number must be exactly 10 digits.");
        setBookingStatus('idle');
        return;
      }

      // 🔍 PERFECT BACKEND MATCH MATRIX
      const appointmentPayload = {
        designerId: designerId,                        // Expected by backend
        appointmentDate: appointmentDate,             // Backend expects 'appointmentDate', NOT 'date'
        appointmentTime: appointmentTime,             // Backend expects 'appointmentTime', NOT 'time'
        serviceType: serviceType || "Consultation",   // 🌟 REQUIRED BY BACKEND
        contactPhone: cleanedPhone,                   // 🌟 REQUIRED BY BACKEND
        location: consultationLocation.trim(),         // Expected by backend
        notes: clientNotes.trim() || "No custom notes registered." // Optional
      };

      // Calls POST /api/appointment
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentPayload, {
        headers: { 
          Authorization: `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setBookingStatus('pending_confirmed');
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/client/dashboard');
        }, 2500);
      }
    } catch (err: any) {
      console.error("Booking transmission dropped:", err.response?.data);
      setErrorMessage(err.response?.data?.message || "FAILED TO BOOK APPOINTMENT");
      setBookingStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-[#FAFAFA] min-h-screen">
        <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
        <span>DECRYPTION AND PIPELINE COMPILING IN PROGRESS...</span>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="p-8 font-mono text-xs text-center text-neutral-500 bg-[#FAFAFA] min-h-screen">
        STUDIO PROFILE NOT INIALIZED OR ARCHIVED BY NETWORK GATES.
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen max-w-7xl mx-auto space-y-12 animate-fade-in">
      
      {/* Upper Atelier Corporate Identification Block */}
      <div className="bg-white border border-neutral-200/60 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
        <div className="w-32 h-32 bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
          <img 
            src={designer.profileImage || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"} 
            alt="Designer Identity" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1">
              ✦ Verified Atelier Resident
            </div>
            <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
              {typeof designer.userId === 'object' ? designer.userId.name : 'Master Studio Architect'}
            </h1>
            <p className="text-xs font-mono text-neutral-400 mt-1">{designer.location || "Location Coordinates Restricted"}</p>
          </div>

          <p className="text-xs font-light text-neutral-600 max-w-3xl leading-relaxed italic">
            "{designer.bio || 'No philosophy statement registered by developer matrices.'}"
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs font-mono border-t border-neutral-100">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Award size={14} className="text-[#D4AF37]" />
              <span>EXPERIENCE: <strong className="text-black">{designer.experience || 0} YEARS</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span>STYLE: <strong className="text-black uppercase">{designer.style || 'Universal'}</strong></span>
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-4 w-full md:w-auto">
          {/* TRIGGER BUTTON FOR THE APPOINTMENT MODAL POPUP */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-black text-white hover:bg-neutral-900 px-8 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-all"
          >
            Initiate Consultation Request
          </button>
        </div>
      </div>

      {/* PORTFOLIO GALLERY CONTAINER SECTION */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 pb-3 flex items-center gap-2">
          <Layers size={14} className="text-[#D4AF37]" />
          <h2 className="text-xs font-mono tracking-widest uppercase font-bold text-black">Design Showroom Rooms ({portfolios.length})</h2>
        </div>

        {portfolios.length === 0 ? (
          <div className="border border-neutral-200 border-dashed bg-white p-12 text-center text-neutral-400 font-mono text-xs tracking-widest">
            THIS DESIGNER HAS NOT LINKED PORTFOLIO CARDS YET.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {portfolios.map((project) => (
    <div 
      key={project._id} 
      onClick={() => setSelectedProject(project)} // 👈 Makes the entire card clickable!
      className="bg-white border border-neutral-200/60 shadow-sm flex flex-col group cursor-pointer hover:shadow-md hover:border-neutral-400 transition-all duration-300"
    >
      <div className="aspect-video w-full bg-neutral-100 overflow-hidden border-b border-neutral-100 relative">
        <img 
          src={project.images?.[0]} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-black text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 shadow-sm">
            View Details
          </span>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#D4AF37]">{project.category || "Atelier Layout"}</span>
          <h3 className="text-sm font-luxury text-black uppercase tracking-wider mt-0.5">{project.title}</h3>
          <p className="text-[11px] text-neutral-400 font-light mt-1.5 line-clamp-3 leading-relaxed">{project.description}</p>
        </div>
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase text-neutral-400">Execution Estimate</span>
          <span className="text-xs font-mono text-black font-bold">{project.priceRange || '₹ Custom Request'}</span>
        </div>
      </div>
    </div>
  ))}
</div>
        )}
      </div>

      {/* ─── APPOINTMENT MODAL POPUP GATE ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white border border-neutral-200 w-full max-w-xl p-8 space-y-6 relative animate-slide-up shadow-xl">
            
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            {bookingStatus === 'pending_confirmed' ? (
              /* Success Pending Banner Notification Display node */
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <CheckCircle size={44} className="text-emerald-500 animate-bounce" />
                <h3 className="text-sm font-mono uppercase tracking-widest font-bold text-black">Request Dispatched</h3>
                <p className="text-xs font-light text-neutral-400 max-w-sm leading-relaxed">
                  The appointment status is initialized as <strong className="text-amber-600 uppercase font-mono">Pending</strong> awaiting response from the master artisan.
                </p>
              </div>
            ) : (
              /* Appointment Configuration Form Input Fields Node */
              <>
                <div className="border-b border-neutral-100 pb-3">
                  <h3 className="text-sm font-luxury uppercase tracking-wider text-black">Consultation Parameters</h3>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase mt-1">Configure layout, timeframe coordinates and delivery pipelines.</p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border-l-2 border-rose-600 font-mono text-[11px] text-rose-900 uppercase">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleCreateAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono uppercase font-bold text-neutral-400">Target Calendar Date</label>
                      <div className="relative">
                        <Calendar size={12} className="absolute left-3 top-3.5 text-neutral-400" />
                        <input 
                          type="date" 
                          required 
                          value={appointmentDate} 
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full bg-[#FAFAFA] border border-neutral-200 p-2.5 pl-8 text-xs font-mono text-black focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-mono uppercase font-bold text-neutral-400">Target Time Matrix</label>
                      <div className="relative">
                        <Clock size={12} className="absolute left-3 top-3.5 text-neutral-400" />
                        <input 
                          type="time" 
                          required 
                          value={appointmentTime} 
                          onChange={(e) => setAppointmentTime(e.target.value)}
                          className="w-full bg-[#FAFAFA] border border-neutral-200 p-2.5 pl-8 text-xs font-mono text-black focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
    <label className="block text-[9px] font-mono uppercase font-bold text-neutral-400">Service Type</label>
    <select
      required
      value={serviceType}
      onChange={(e) => setServiceType(e.target.value)}
      className="w-full bg-[#FAFAFA] border border-neutral-200 p-2.5 text-xs font-mono text-black focus:outline-none"
    >
      <option value="Consultation">Consultation Meeting</option>
      <option value="Space Planning">Space Planning & Layout</option>
      <option value="Renovation">Full Home Renovation</option>
      <option value="Commercial">Commercial/Office Design</option>
    </select>
  </div>

  {/* 📥 ADDED BLOCK 2: CONTACT PHONE */}
  <div className="space-y-1">
    <label className="block text-[9px] font-mono uppercase font-bold text-neutral-400">Contact Phone Number</label>
    <input 
      type="tel" 
      required 
      minLength={10}
      maxLength={10}
      placeholder="Enter your 10-digit mobile number"
      value={contactPhone}
      onChange={(e) => {
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 10) {
          setContactPhone(val);
        }
      }}
      className="w-full bg-[#FAFAFA] border border-neutral-200 p-2.5 text-xs font-mono text-black focus:outline-none"
    />
  </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono uppercase font-bold text-neutral-400">Execution Site Location</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., Client Site or Virtual Conference Link"
                      value={consultationLocation}
                      onChange={(e) => setConsultationLocation(e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-neutral-200 p-2.5 text-xs font-mono text-black focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono uppercase font-bold text-neutral-400">Project Brief Notes</label>
                    <div className="relative">
                      <MessageSquare size={12} className="absolute left-3 top-3.5 text-neutral-400" />
                      <textarea 
                        rows={3}
                        required
                        placeholder="State structural constraints, timeline boundaries, design aesthetics preferences..."
                        value={clientNotes}
                        onChange={(e) => setClientNotes(e.target.value)}
                        className="w-full bg-[#FAFAFA] border border-neutral-200 p-2.5 pl-8 text-xs font-light text-black focus:outline-none focus:border-black resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingStatus === 'submitting'}
                    className="w-full bg-black text-white py-3.5 font-mono text-xs uppercase tracking-widest font-bold hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {bookingStatus === 'submitting' ? (
                      <>
                        <Loader2 className="animate-spin text-[#D4AF37]" size={14} />
                        <span>ALLOCATING ROUTING RESERVATION...</span>
                      </>
                    ) : (
                      <span>Submit Appointment Allocation Request</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-neutral-200 w-full max-w-3xl p-8 max-h-[90vh] overflow-y-auto relative animate-slide-up shadow-2xl space-y-6">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="border-b border-neutral-100 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                {selectedProject.category || "Project Showcase"}
              </span>
              <h2 className="text-xl font-luxury uppercase tracking-wider text-black mt-1">
                {selectedProject.title}
              </h2>
            </div>

            {/* Image Showcase Grid/Scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedProject.images?.map((img, idx) => (
                <div key={idx} className="aspect-video w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
                  <img src={img} alt={`Showcase view ${idx + 1}`} className="w-full h-full object-cover hover:scale-102 transition-transform duration-300" />
                </div>
              ))}
            </div>

            {/* Details Description Narrative */}
            <div className="space-y-2 bg-[#FAFAFA] p-5 border border-neutral-100">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Project Concept & Breakdown</h4>
              <p className="text-xs font-light text-neutral-700 leading-relaxed whitespace-pre-line">
                {selectedProject.description}
              </p>
            </div>

            {/* Pricing / Actions Footer */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="block text-[9px] font-mono uppercase text-neutral-400 tracking-wider">Estimated Project Budget</span>
                <span className="text-base font-mono text-black font-bold">{selectedProject.priceRange || '₹ Quote on Request'}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsModalOpen(true);
                }}
                className="w-full sm:w-auto bg-black text-white hover:bg-neutral-900 px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-colors"
              >
                Book Consultation For This Style
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};