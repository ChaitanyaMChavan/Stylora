import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Plus, Image, Trash2, Sparkles, CheckCircle } from 'lucide-react';

export const DesignerPortfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState([
    { id: 'p1', title: 'The Monolith Lounge', category: 'Residential', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80' },
    { id: 'p2', title: 'Brutalist Glass Pavilion', category: 'Commercial Space', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80' }
  ]);

  const [form, setForm] = useState({ title: '', category: 'Residential', img: '' });
  const [success, setSuccess] = useState(false);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: `p-${Date.now()}`,
      title: form.title.toUpperCase(),
      category: form.category,
      img: form.img || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80'
    };
    setPortfolioItems([newItem, ...portfolioItems]);
    setForm({ title: '', category: 'Residential', img: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDeleteAsset = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-2 animate-fade-in items-start">
      
      {/* Asset Registration Terminal */}
      <div className="lg:col-span-4 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Lookbook Curator Engine</span>
          <h1 className="text-2xl font-luxury uppercase tracking-wide text-black">Append Lookbook Asset</h1>
        </div>

        <Card className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none">
          {success && (
            <div className="mb-4 p-3 bg-neutral-950 text-white text-[9px] uppercase tracking-widest font-bold border border-[#D4AF37] flex items-center gap-2 animate-slide-in">
              <CheckCircle size={12} className="text-[#D4AF37]" /> Blueprint asset linked to portfolio matrix successfully.
            </div>
          )}

          <form onSubmit={handleAddAsset} className="space-y-4">
            <div>
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold mb-1">Asset Concept Name</label>
              <input type="text" required className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none font-mono" placeholder="VELVET HORIZON DINING ROOM" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div>
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold mb-1">Spatial Context Category</label>
              <select className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white rounded-none font-mono" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="Residential">Residential</option>
                <option value="Commercial Space">Commercial Space</option>
                <option value="Hospitality Layout">Hospitality Layout</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold mb-1">Blueprint Imagery Link (URL)</label>
              <input type="url" className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black rounded-none font-mono" placeholder="https://images.unsplash.com/..." value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} />
            </div>

            <Button type="submit" variant="primary" size="sm" fullWidth>
              <Plus size={12} className="mr-1" /> Append Framework Asset
            </Button>
          </form>
        </Card>
      </div>

      {/* Exhibition Grid Stream */}
      <div className="lg:col-span-8 space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-bold text-black border-b border-neutral-100 pb-2">Currently Cataloged Lookbook Blueprint Matrix</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden bg-white border border-neutral-200/60 rounded-none shadow-none flex flex-col justify-between group relative">
              <div className="h-48 bg-neutral-100 overflow-hidden relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0" />
                <button onClick={() => handleDeleteAsset(item.id)} className="absolute top-2 right-2 bg-black text-white p-2 hover:bg-rose-700 transition-colors cursor-pointer border border-white/10 shadow-lg">
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="p-4 bg-white space-y-0.5">
                <span className="text-[9px] tracking-widest font-bold text-[#D4AF37] uppercase font-mono block">{item.category}</span>
                <h4 className="text-xs uppercase font-bold text-black tracking-wide font-mono truncate">{item.title}</h4>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};