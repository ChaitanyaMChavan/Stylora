import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Star, Send, Sparkles, CheckCircle } from 'lucide-react';

export const ClientReviews: React.FC = () => {
  const [reviews] = useState([
    { id: 'REV-10', studio: 'Kanso Interiors', rating: 5, date: 'May 24, 2026', content: 'Incredible command over natural lighting assets and organic Japanese wood material balancing.' }
  ]);

  const [form, setForm] = useState({ studio: 'Atelier Maurice', rating: 5, feedback: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setForm({ studio: 'Atelier Maurice', rating: 5, feedback: '' });
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-2 animate-fade-in items-start">
      
      {/* Review Submission Form Terminal */}
      <div className="lg:col-span-5 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Project Verification Loop</span>
          <h1 className="text-2xl font-luxury uppercase tracking-wide text-black">Submit Performance Evaluation</h1>
        </div>

        <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none">
          {success && (
            <div className="mb-4 p-3 bg-neutral-950 text-white text-[9px] uppercase tracking-widest font-bold border border-[#D4AF37] flex items-center gap-2">
              <CheckCircle size={12} className="text-[#D4AF37]" /> Performance rating successfully appended to designer network stream.
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold mb-1">Target Design Atelier</label>
              <select className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white rounded-none font-mono" value={form.studio} onChange={e => setForm({ ...form, studio: e.target.value })}>
                <option value="Atelier Maurice">Atelier Maurice</option>
                <option value="Vanguard Structural">Vanguard Structural</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold mb-1">Assigned Quality Metric Score</label>
              <select className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white rounded-none font-mono" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                <option value={5}>⭐⭐⭐⭐⭐ [5/5 Elite Execution]</option>
                <option value={4}>⭐⭐⭐⭐ [4/5 Premium Quality]</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold mb-1">Detailed Evaluation Assessment</label>
              <textarea rows={4} required className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black rounded-none resize-none font-mono leading-relaxed" placeholder="Compile your thoughts regarding geometry control, timeline delays, or material accuracy choices..." value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} />
            </div>

            <Button type="submit" variant="primary" size="sm" fullWidth>
              <Send size={10} className="mr-1.5" /> Dispatch Assessment
            </Button>
          </form>
        </Card>
      </div>

      {/* Historical Evaluations Ledger */}
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-neutral-100 pb-2">Your Historical Dispatches</h3>
        
        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="bg-neutral-50/50 p-5 border border-neutral-200/40 rounded-none shadow-none space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-black">{rev.studio}</span>
                <span className="text-[9px] font-mono text-neutral-400">{rev.date}</span>
              </div>
              <div className="flex gap-0.5 text-[#D4AF37]">
                {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              </div>
              <p className="text-xs text-neutral-500 font-mono font-light leading-relaxed pt-1">"{rev.content}"</p>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};