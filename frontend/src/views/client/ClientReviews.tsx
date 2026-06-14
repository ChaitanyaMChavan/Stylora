import React from 'react';
import { Card } from '../../components/ui/card';
import { Star, MessageSquare } from 'lucide-react';

export const ClientReviews: React.FC = () => {
  const pastReviews = [
    { id: '1', designer: 'Eleanor Vance', project: 'Monolith Penthouse', rating: 5, feedback: 'Absolute high-end precision. The marble sourcing was perfect and matches our spatial signature beautifully.', date: 'Jan 14, 2026' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">My Expressions</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Reviews submitted for completed spatial projects</p>
      </div>

      <div className="space-y-4 max-w-4xl">
        {pastReviews.map((rev) => (
          <Card key={rev.id} className="bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-50 pb-3">
              <div>
                <span className="text-[9px] tracking-widest text-neutral-400 uppercase block">Project Critique</span>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wide">{rev.designer} — {rev.project}</h3>
              </div>
              <div className="flex items-center gap-0.5 bg-black px-2 py-1 text-white text-[10px] font-bold">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} size={10} className="fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
            </div>

            <div className="flex gap-3 items-start text-neutral-600">
              <MessageSquare size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-xs font-light leading-relaxed italic">"{rev.feedback}"</p>
            </div>

            <span className="text-[9px] uppercase tracking-widest text-neutral-400 block text-right">{rev.date}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};