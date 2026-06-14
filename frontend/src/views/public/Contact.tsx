import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Mail, Phone, MapPin, CheckCircle, Send, ShieldAlert } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', query: '' });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', query: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-6 animate-fade-in items-stretch">
      
      {/* Heavy Luxury Info Block Card */}
      <div className="lg:col-span-4 bg-neutral-950 border border-black text-white p-8 flex flex-col justify-between space-y-12 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 text-[160px] font-luxury text-white/[0.01] select-none pointer-events-none font-light">
          HQ
        </div>
        
        <div className="space-y-4">
          <div className="inline-block border border-white/10 bg-white/5 px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
            Concierge Matrix
          </div>
          <h1 className="text-3xl font-luxury uppercase tracking-wide text-white leading-tight">
            Direct <br />Enquiry Lines
          </h1>
          <p className="text-xs text-neutral-400 font-light leading-relaxed font-mono">
            Connect with platform gatekeepers regarding system authorization timelines or corporate profile setup requirements.
          </p>
        </div>

        <div className="space-y-6 text-[11px] text-neutral-300 font-mono uppercase tracking-widest pt-6 border-t border-white/10">
          <div className="flex items-center gap-3.5 group">
            <div className="p-2 border border-white/10 bg-white/5 text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
              <Mail size={12} />
            </div>
            <span>concierge@stylora.com</span>
          </div>
          
          <div className="flex items-center gap-3.5 group">
            <div className="p-2 border border-white/10 bg-white/5 text-white group-hover:border-white transition-colors">
              <Phone size={12} />
            </div>
            <span>+91 20 8472 9102</span>
          </div>
          
          <div className="flex items-center gap-3.5 group">
            <div className="p-2 border border-white/10 bg-white/5 text-[#D4AF37] group-hover:border-[#D4AF37] transition-colors">
              <MapPin size={12} />
            </div>
            <span className="normal-case font-light text-neutral-400">Koregaon Park, Pune, MH</span>
          </div>
        </div>
      </div>

      {/* Crisp Editorial Interactive Form */}
      <div className="lg:col-span-8 flex flex-col justify-center">
        <Card className="bg-white p-8 border border-neutral-200/60 rounded-none shadow-none relative">
          
          {submitted && (
            <div className="mb-6 p-4 bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-bold border border-[#D4AF37] flex items-center gap-3 animate-slide-in">
              <CheckCircle size={14} className="text-[#D4AF37]" /> 
              Your transmission package has been dispatched to the platform command desk.
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Identity Signature</label>
                <input 
                  type="text" 
                  required 
                  className="w-full border-b border-neutral-200 px-0 py-2.5 text-xs focus:outline-none focus:border-black bg-transparent rounded-none transition-colors font-mono"
                  placeholder="CHAITANYA CHAVAN"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value.toUpperCase() })}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Correspondence Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full border-b border-neutral-200 px-0 py-2.5 text-xs focus:outline-none focus:border-black bg-transparent rounded-none transition-colors font-mono"
                  placeholder="NAME@EXAMPLE.COM"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Message Packet Contents</label>
              <textarea 
                rows={4} 
                required
                className="w-full border border-neutral-200 p-4 text-xs focus:outline-none focus:border-black bg-neutral-50/50 rounded-none resize-none font-light leading-relaxed transition-colors"
                placeholder="State your technical inquiries, verification timeline bottlenecks, or workspace alignment needs..."
                value={form.query}
                onChange={e => setForm({ ...form, query: e.target.value })}
              />
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 border border-black bg-black text-white px-8 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-900 transition-colors cursor-pointer font-mono"
              >
                <Send size={10} /> Route Transmission
              </button>
            </div>
          </form>
        </Card>
      </div>

    </div>
  );
};