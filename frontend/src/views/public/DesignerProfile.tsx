import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { MapPin, Sparkles, Calendar, Clock, Phone, Layers, X, CheckCircle } from 'lucide-react';

export const DesignerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock profile structured matching your backend data blueprints
  const designer = {
    id: id || 'DSG-MOCK',
    name: 'Atelier Maurice',
    style: 'Mid-Century Modern',
    location: 'Paris, France',
    experience: 8,
    specialization: 'Residential Penthouses & Lofts',
    bio: 'Crafting highly customized architectural living spaces that prioritize geometric precision, natural luminescent dynamics, and premium sustainable materials.',
    contactPhone: '+1 234 567 890',
    portfolios: [
      { id: 'p1', title: 'The Monolith Lounge', category: 'Residential', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80' },
      { id: 'p2', title: 'Brutalist Glass Pavilion', category: 'Commercial Space', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80' },
      { id: 'p3', title: 'Velvet Horizon Dining Room', category: 'Residential', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80' }
    ]
  };

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Local form state representing request payloads exactly
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '10:00 AM',
    serviceType: 'Consultation',
    notes: '',
    contactPhone: '',
    location: ''
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBookingOpen(false);
    setSuccessMessage('Your consultation booking request has been dispatched to the designer lounge stream!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="space-y-12 py-2 animate-fade-in relative">
      
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-black text-white text-xs uppercase tracking-widest font-bold border border-[#D4AF37] shadow-xl flex items-center gap-3 animate-slide-in">
          <CheckCircle size={16} className="text-[#D4AF37]" />
          {successMessage}
        </div>
      )}

      {/* Profile Header Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-b border-black/5 pb-10">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
            <Sparkles size={12} /> Elite House Resident {designer.id}
          </div>
          <h1 className="text-4xl font-luxury uppercase tracking-wide text-black">{designer.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 uppercase tracking-wider font-light pt-1">
            <div className="flex items-center gap-1"><MapPin size={13} className="text-black" /> {designer.location}</div>
            <div>•</div>
            <div className="flex items-center gap-1"><Layers size={13} className="text-black" /> {designer.style}</div>
            <div>•</div>
            <div>{designer.experience} Years Master Practice</div>
          </div>

          <p className="text-sm font-light leading-relaxed text-neutral-600 max-w-2xl pt-2">
            {designer.bio}
          </p>
        </div>

        <Card className="bg-neutral-50/50 border border-black/5 p-6 space-y-4">
          <div className="space-y-1">
            <span className="text-[9px] tracking-widest text-neutral-400 uppercase block font-medium">Availability Status</span>
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 inline-block">
              Accepting Commissions
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-light">Secure an inspection review or virtual architectural walkthrough directly.</p>
          <Button variant="primary" size="md" fullWidth onClick={() => setIsBookingOpen(true)}>
            <Calendar size={13} className="mr-1.5" /> Initialize Consultation
          </Button>
        </Card>
      </div>

      {/* Portfolio Lookbook Grid Layout */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xs uppercase tracking-widest font-bold text-black">Exhibited Creative Asset Catalog</h3>
          <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Verified blueprints and historical structural layouts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designer.portfolios.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden group border border-neutral-100 flex flex-col justify-between">
              <div className="h-60 bg-neutral-100 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-4 bg-white">
                <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase block font-bold">{item.category}</span>
                <h4 className="text-xs uppercase font-bold text-black tracking-wide mt-0.5">{item.title}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Screen Interactive Booking Sheet Drawer Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-lg bg-white p-6 relative max-h-[90vh] overflow-y-auto space-y-6 border border-black/10 shadow-2xl">
            <button 
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors cursor-pointer p-1"
            >
              <X size={18} />
            </button>

            <div className="space-y-1 pr-6">
              <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase block font-bold">Appointment Matrix</span>
              <h3 className="text-xl font-luxury uppercase text-black">Commission {designer.name}</h3>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Target Date</label>
                  <input 
                    type="date" 
                    required 
                    className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                    value={formData.appointmentDate}
                    onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Target Time Window</label>
                  <select 
                    className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                    value={formData.appointmentTime}
                    onChange={e => setFormData({ ...formData, appointmentTime: e.target.value })}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Service Type</label>
                  <select 
                    className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                    value={formData.serviceType}
                    onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="Consultation">Spatial Consultation</option>
                    <option value="Spatial Auditing">Bespoke Blueprint Auditing</option>
                    <option value="Turnkey Execution">Turnkey Execution Plan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Callback Contact Phone</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+91 98765 43210"
                    className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                    value={formData.contactPhone}
                    onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Site Address Location</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Penthouse Suite B, Koregaon Park"
                  className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Design Brief & Structural Notes</label>
                <textarea 
                  rows={3} 
                  placeholder="Describe your stylistic aspirations, space limitations, and palette preferences..."
                  className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black resize-none font-light leading-relaxed"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsBookingOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Dispatch Request Matrix
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};