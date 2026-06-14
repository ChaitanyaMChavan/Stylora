import React from 'react';
import { Card } from '../../components/ui/card';
import { Sparkles, Eye, ShieldCheck, PenTool, ArrowUpRight } from 'lucide-react';

export const About: React.FC = () => {
  const values = [
    { 
      title: 'Architectural Rigor', 
      desc: 'Every designer profile underwent structural review. We catalog only those exhibiting authentic spatial command and material precision.', 
      icon: <PenTool size={16} className="text-[#D4AF37]" /> 
    },
    { 
      title: 'Bespoke Curation', 
      desc: 'We bypass the mundane. Our collective showcases rare geometric frameworks, pristine textures, and elevated residential aesthetics.', 
      icon: <Eye size={16} className="text-white" /> 
    },
    { 
      title: 'Structural Sanctity', 
      desc: 'Direct channels connect your custom site metadata and appointments. Secure data management keeps your private space completely hidden.', 
      icon: <ShieldCheck size={16} className="text-[#D4AF37]" /> 
    }
  ];

  return (
    <div className="space-y-20 py-6 animate-fade-in">
      {/* Editorial Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-black/5 pb-14">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 border border-black/5 bg-neutral-50 px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-[#D4AF37]">
            <Sparkles size={10} /> The Stylora Manifesto
          </div>
          <h1 className="text-4xl sm:text-6xl font-luxury uppercase tracking-wide text-black leading-none">
            Architecting <br />
            <span className="text-neutral-400 font-light italic font-sans lowercase">the</span> Uncommon.
          </h1>
          <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed max-w-xl font-mono">
            Stylora functions as an exclusive pipeline connecting elite interior architects with clients who view living environments as high art forms.
          </p>
        </div>
        <div className="lg:col-span-5 h-72 bg-neutral-900 border border-black relative overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" 
            alt="Minimalist Architecture" 
            className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[9px] tracking-widest font-bold text-[#D4AF37] uppercase block">Est. 2026</span>
            <span className="text-sm font-luxury uppercase text-white tracking-wide">Premium Spatial Network</span>
          </div>
        </div>
      </div>

      {/* Core Architectural Values Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[9px] tracking-widest text-neutral-400 uppercase font-bold">Uncompromising Rules</span>
          <h2 className="text-2xl font-luxury uppercase text-black tracking-wide">Ecosystem Pillars</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <Card key={idx} className="bg-white p-8 border border-neutral-200/60 rounded-none shadow-none flex flex-col justify-between group hover:border-black transition-colors duration-500">
              <div className="space-y-4">
                <div className="p-3 bg-neutral-950 text-white inline-block border border-black group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-500">
                  {val.icon}
                </div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-black">{val.title}</h3>
                <p className="text-xs text-neutral-400 font-light leading-relaxed font-mono">{val.desc}</p>
              </div>
              <div className="pt-6 flex justify-end text-neutral-300 group-hover:text-black transition-colors">
                <ArrowUpRight size={14} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Heavy Statement Dark Callout */}
      <div className="bg-neutral-950 border border-black p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 text-[120px] font-luxury text-white/[0.02] select-none leading-none pointer-events-none uppercase tracking-tighter">
          Atelier
        </div>
        <div className="space-y-2 max-w-xl z-10">
          <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold block">Professional Registry Entry</span>
          <h3 className="text-2xl font-luxury uppercase tracking-wider text-white">Are you an elite spatial designer?</h3>
          <p className="text-xs text-neutral-400 font-light leading-relaxed font-mono">
            Exhibit your certified lookbook portfolios to an exclusive database of premium global clients looking for bespoke executions.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#D4AF37] bg-transparent text-[#D4AF37] px-8 py-3.5 text-[10px] uppercase tracking-widest font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-mono cursor-pointer">
            Apply to the Index Matrix
          </button>
        </div>
      </div>
    </div>
  );
};