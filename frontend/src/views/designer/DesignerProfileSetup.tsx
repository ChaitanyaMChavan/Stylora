import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Save, Sparkles, CheckCircle } from 'lucide-react';

export const DesignerProfileSetup: React.FC = () => {
  const [form, setForm] = useState({
    name: 'ATELIER MAURICE',
    style: 'Mid-Century Modern',
    location: 'Paris, France',
    experience: 8,
    specialization: 'Residential Penthouses & Lofts',
    bio: 'Crafting highly customized architectural living spaces that prioritize geometric precision, natural luminescent dynamics, and premium sustainable materials.'
  });
  
  const [success, setSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-4 space-y-1">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Identity Configuration Matrix</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Atelier Profile Studio</h1>
      </div>

      <Card className="bg-white p-8 border border-neutral-200/60 rounded-none shadow-none">
        {success && (
          <div className="mb-6 p-4 bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-bold border border-[#D4AF37] flex items-center gap-2 animate-slide-in">
            <CheckCircle size={14} className="text-[#D4AF37]" /> Studio registry metadata records successfully written down!
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Studio Brand Denomination</label>
              <input type="text" required className="w-full border-b border-neutral-200 px-0 py-2 text-xs focus:outline-none focus:border-black bg-transparent font-mono uppercase" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Primary Style Genre</label>
              <input type="text" required className="w-full border-b border-neutral-200 px-0 py-2 text-xs focus:outline-none focus:border-black bg-transparent font-mono" value={form.style} onChange={e => setForm({ ...form, style: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Base Geographic Location</label>
              <input type="text" required className="w-full border-b border-neutral-200 px-0 py-2 text-xs focus:outline-none focus:border-black bg-transparent font-mono" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Years Practice Experience</label>
              <input type="number" required className="w-full border-b border-neutral-200 px-0 py-2 text-xs focus:outline-none focus:border-black bg-transparent font-mono" value={form.experience} onChange={e => setForm({ ...form, experience: Number(e.target.value) })} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Specialization Scope Focal Area</label>
            <input type="text" required className="w-full border-b border-neutral-200 px-0 py-2 text-xs focus:outline-none focus:border-black bg-transparent font-mono" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold">Atelier Manifesto Narrative Bio</label>
            <textarea rows={4} required className="w-full border border-neutral-200 p-4 text-xs focus:outline-none focus:border-black bg-neutral-50/30 rounded-none resize-none font-mono leading-relaxed" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="inline-flex items-center gap-2 border border-black bg-black text-white px-8 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-neutral-900 transition-colors cursor-pointer font-mono">
              <Save size={12} /> Save Studio Profile
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};