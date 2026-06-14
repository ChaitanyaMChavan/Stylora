import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { MapPin, Sparkles, SlidersHorizontal } from 'lucide-react';

export const Designers: React.FC = () => {
  const navigate = useNavigate();
  
  // High-fidelity fallback lookbook array matching your exact visual guidelines
  const [designers] = useState([
    {
      _id: 'DSG-001',
      name: 'Atelier Maurice',
      style: 'Mid-Century Modern',
      location: 'Paris, France',
      specialization: 'Residential Penthouses & Lofts',
      experience: 8,
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
    },
    {
      _id: 'DSG-002',
      name: 'Vanguard Structural',
      style: 'Brutalist Minimalist',
      location: 'Milan, Italy',
      specialization: 'Commercial Showrooms & Studios',
      experience: 12,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80'
    },
    {
      _id: 'DSG-003',
      name: 'Kanso Interiors',
      style: 'Japandi Zen',
      location: 'Kyoto, Japan',
      specialization: 'Wellness Spaces & Luxury Villas',
      experience: 6,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  return (
    <div className="space-y-12 py-4 animate-fade-in">
      {/* Title & Filter Row Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Curated Indexes</span>
          <h1 className="text-4xl font-luxury text-black uppercase tracking-wide">The House Roster</h1>
          <p className="text-xs text-neutral-400 font-light">Connect with verified spatial interior architects globally</p>
        </div>
        
        <div className="flex items-center gap-2 border border-neutral-200 px-4 py-2 text-xs uppercase tracking-widest font-mono font-medium cursor-pointer hover:border-black transition-colors bg-white">
          <SlidersHorizontal size={12} /> Refine Matrix View
        </div>
      </div>

      {/* Grid Layout Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {designers.map((designer) => (
          <Card key={designer._id} className="p-0 overflow-hidden bg-white luxury-hover flex flex-col justify-between rounded-none shadow-none border border-neutral-200/60">
            <div className="h-64 bg-neutral-100 relative overflow-hidden group">
              <img 
                src={designer.image} 
                alt={designer.name} 
                className="w-full h-full object-cover grayscale opacity-95 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-3 left-3 bg-black text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold font-mono">
                {designer.style}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
                  <Sparkles size={10} /> {designer.experience}+ Years Active Elite Architecture
                </div>
                <h3 className="text-xl font-luxury uppercase tracking-wide text-black pt-0.5">{designer.name}</h3>
                <p className="text-xs text-neutral-400 font-light italic truncate">Specializing in {designer.specialization}</p>
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <div className="flex items-center gap-1 text-xs text-neutral-500 font-light">
                  <MapPin size={12} className="text-black" /> {designer.location}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/designer/${designer._id}`)}
                >
                  Enter Atelier
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};