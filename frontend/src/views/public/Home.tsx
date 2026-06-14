import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/card';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const luxurySpotlights = [
    { title: 'Avant-Garde Spaces', desc: 'Pushing design boundaries with structural minimalism.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80' },
    { title: 'The Bespoke Lounge', desc: 'Crafting tailored interiors for private clients worldwide.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Editorial Hero Space */}
      <section className="relative h-[85vh] bg-neutral-900 flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80" 
            alt="Editorial Background" 
            className="w-full h-full object-cover scale-105 animate-pulse transition-all duration-[8000ms]"
          />
        </div>
        
        <div className="relative max-w-4xl text-center space-y-6 text-white z-10">
          <span className="text-[11px] font-medium tracking-[0.4em] uppercase text-[#D4AF37] block">The Pinnacle of Interior Architecture</span>
          <h1 className="text-5xl lg:text-7xl font-luxury tracking-tight leading-none">
            Where Vision Meets <br />
            <span className="italic font-light">Haute Architecture</span>
          </h1>
          <p className="text-xs lg:text-sm font-light tracking-widest text-neutral-300 max-w-xl mx-auto uppercase leading-relaxed">
            Connect with award-winning spaces curated by verified designers globally.
          </p>
          <div className="pt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/designers')} className="hover:border-[#D4AF37]">
              Explore The Index <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Values/Value Props Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-3">
          <Compass className="text-[#D4AF37]" size={24} />
          <h3 className="text-lg uppercase tracking-wider font-semibold">Curation Architecture</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">We bypass the generic to register only premier design practices specializing in residential and spatial transformations.</p>
        </div>
        <div className="space-y-3">
          <Shield className="text-[#D4AF37]" size={24} />
          <h3 className="text-lg uppercase tracking-wider font-semibold">End-to-End Encapsulation</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">From initial design consults to escrow-secured deposit pipelines, your spatial projects are tracked seamlessly.</p>
        </div>
        <div className="space-y-3">
          <Sparkles className="text-[#D4AF37]" size={24} />
          <h3 className="text-lg uppercase tracking-wider font-semibold">Bespoke Matches</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">Filter by specific aesthetics, technical specializations, or geographic availability to match your exact style signature.</p>
        </div>
      </section>

      {/* Asymmetric Split Spotlights Showcase */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="border-b border-black/5 pb-4">
          <h2 className="text-3xl font-luxury uppercase tracking-wide">Featured Atelier Collections</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {luxurySpotlights.map((spot, idx) => (
            <Card key={idx} className="p-0 overflow-hidden flex flex-col group">
              <div className="h-96 w-full overflow-hidden relative">
                <img 
                  src={spot.image} 
                  alt={spot.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-[9px] tracking-[0.3em] font-semibold text-[#D4AF37] uppercase block mb-1">Featured Look</span>
                  <h3 className="text-xl font-luxury uppercase tracking-wider">{spot.title}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4 bg-white flex-grow flex flex-col justify-between">
                <p className="text-xs text-neutral-500 leading-relaxed">{spot.desc}</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/designers')} className="self-start">
                  View Collection
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};