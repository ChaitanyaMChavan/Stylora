import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2, FolderHeart } from 'lucide-react';

export const DesignerPortfolio: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', title: 'Modern Living Room', category: 'Residential', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=500&q=80', range: '$$$' },
    { id: '2', title: 'Glass Pavilion Showroom', category: 'Commercial Space', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=80', range: '$$$$' }
  ]);

  const [form, setForm] = useState({ title: '', category: 'Residential', image: '', range: '$$$' });
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) return;
    
    setItems(prev => [...prev, { id: Date.now().toString(), ...form }]);
    setForm({ title: '', category: 'Residential', image: '', range: '$$$' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Portfolio Studio</h1>
          <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Exhibit your interior architecture blueprints</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus size={14} className="mr-1" /> {isAdding ? 'Close Studio Deck' : 'Add Lookbook Work'}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="border border-black/5 bg-white p-6 max-w-xl space-y-4 luxury-hover">
          <h3 className="text-xs uppercase tracking-widest font-bold text-black mb-2 flex items-center gap-1">
            <FolderHeart size={14} className="text-[#D4AF37]" /> Log Fine Creative Asset
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Asset Title</label>
              <input 
                type="text" 
                required 
                className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
                placeholder="The Monolith Lounge"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Price Hierarchy</label>
              <select 
                className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
                value={form.range}
                onChange={e => setForm({ ...form, range: e.target.value })}
              >
                <option value="$">$ (Minimal)</option>
                <option value="$$">$$ (Standard)</option>
                <option value="$$$">$$$ (Premium)</option>
                <option value="$$$$">$$$$ (Ultra Luxury)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Category Type</label>
            <select 
              className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black bg-white"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="Residential">Residential Development</option>
              <option value="Commercial Space">Commercial Space</option>
              <option value="Furniture Design">Furniture Design</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Image Presentation URL</label>
            <input 
              type="url" 
              required 
              className="w-full border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-black"
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <Button type="submit" variant="primary" size="sm">Publish to Atelier Index</Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="p-0 overflow-hidden flex flex-col justify-between group">
            <div className="h-56 bg-neutral-100 overflow-hidden relative">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute top-2 left-2 bg-black text-white text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold">
                {item.range}
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase block font-bold">{item.category}</span>
                <h4 className="text-xs uppercase font-bold text-black tracking-wide mt-0.5">{item.title}</h4>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-neutral-300 hover:text-red-600 transition-colors cursor-pointer p-1"
                title="Remove Lookbook Item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};