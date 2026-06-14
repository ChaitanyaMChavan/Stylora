import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export const DesignerProfileSetup: React.FC = () => {
  const [profile, setProfile] = useState({
    bio: 'Expert in modern minimalist designs.',
    location: 'Milan, Italy',
    style: 'Minimalist',
    experience: '9',
    specialization: 'Residential Penthouses',
    phone: '+123456789',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    isAvailable: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Brand Identity System</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Configure your front-facing public atelier credentials</p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-xs uppercase tracking-wider font-semibold border border-emerald-200/50 flex items-center gap-2">
          <ShieldCheck size={14} /> Studio identity successfully updated.
        </div>
      )}

      <Card className="bg-white p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Aesthetic Archetype</label>
              <input type="text" className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black" value={profile.style} onChange={e => setProfile({...profile, style: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Years Practice</label>
              <input type="number" className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black" value={profile.experience} onChange={e => setProfile({...profile, experience: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">HQ Core Location</label>
              <input type="text" className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Contact Phone</label>
              <input type="text" className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Market Specialization</label>
            <input type="text" className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black" value={profile.specialization} onChange={e => setProfile({...profile, specialization: e.target.value})} />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Editorial Bio</label>
            <textarea rows={4} className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black font-light leading-relaxed resize-none" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="availability" className="accent-black h-3.5 w-3.5" checked={profile.isAvailable} onChange={e => setProfile({...profile, isAvailable: e.target.checked})} />
            <label htmlFor="availability" className="text-[10px] tracking-widest uppercase text-neutral-600 font-semibold cursor-pointer select-none">Accepting public client commissions</label>
          </div>

          <Button type="submit" variant="primary" size="sm" className="mt-2">Commit Configuration</Button>
        </form>
      </Card>
    </div>
  );
};