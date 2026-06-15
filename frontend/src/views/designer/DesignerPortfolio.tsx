import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, AlertCircle, CheckCircle2, FolderPlus, Trash2, Layers, Plus, Image } from 'lucide-react';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  tags?: string[];
  priceRange?: string;
  category?: string;
}

export const DesignerPortfolio: React.FC = () => {
  const { token } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Aligned Form States
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  
  const fetchMyPortfolios = async () => {
    try {
      setLoading(true);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      // FIXED ROUTE NAME: portfolio instead of portfolios
      const response = await axios.get('http://localhost:5000/api/portfolio/my', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setPortfolios(response.data.portfolios || response.data.data || []);
      }
    } catch (err: any) {
      console.error("Error retrieving portfolio collection:", err);
      if (err.response && err.response.status === 404) {
        setPortfolios([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPortfolios();
  }, [token]);

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;
    if (!projectImages.includes(imageUrlInput.trim())) {
      setProjectImages([...projectImages, imageUrlInput.trim()]);
    }
    setImageUrlInput('');
  };

  const handleRemoveDraftImage = (index: number) => {
    setProjectImages(projectImages.filter((_, idx) => idx !== index));
  };

  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectImages.length === 0) {
      setFeedback({ type: 'error', message: 'Please add at least one project visual link.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      const activeToken = token || localStorage.getItem('stylora_auth_token');

      // Schema Mapper targeting database strings perfectly
      const payload = {
        title,
        description,
        images: projectImages,
        priceRange, 
        category,
        tags: ["Interior Design", "Stylora Showcase"]
      };

      const response = await axios.post('http://localhost:5000/api/portfolio', payload, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setFeedback({ type: 'success', message: 'Project committed successfully.' });
        setTitle('');
        setDescription('');
        setPriceRange('');
        setCategory('');
        setProjectImages([]);
        fetchMyPortfolios();
      }
    } catch (err: any) {
      console.error("Portfolio creation failed:", err);
      setFeedback({ type: 'error', message: err.response?.data?.message || 'Check database fields.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (portfolioId: string) => {
    if (!window.confirm("Delete this portfolio item?")) return;
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      const response = await axios.delete(`http://localhost:5000/api/portfolio/${portfolioId}`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (response.data.success) {
        setPortfolios(prev => prev.filter(item => item._id !== portfolioId));
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen max-w-7xl mx-auto">
      <div className="mb-12 border-b border-neutral-200/60 pb-6">
        <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">Portfolio Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2 bg-white border border-neutral-200/60 p-8 shadow-sm">
          <form onSubmit={handleCreatePortfolio} className="space-y-5">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">Project Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-mono text-black" />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">Category</label>
              <input type="text" placeholder="e.g., Living Room, Kitchen" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-mono text-black" />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">Price Range / Cost (₹)</label>
              <input type="text" placeholder="e.g., ₹4,00000 - ₹5,00000" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs font-mono text-black" />
            </div>

            <div>
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">Description</label>
              <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#FAFAFA] border border-neutral-200 p-3 text-xs text-black resize-none" />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-wider text-neutral-400 uppercase font-bold">Image Links</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Paste image URL..." value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} className="flex-1 bg-[#FAFAFA] border border-neutral-200 p-2 text-xs font-mono text-black" />
                <button type="button" onClick={handleAddImageUrl} className="bg-black text-white px-3"><Plus size={14} /></button>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2">
                {projectImages.map((img, index) => (
                  <div key={index} className="relative aspect-square border border-neutral-200 overflow-hidden group">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveDraftImage(index)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2 size={12} className="text-rose-400" /></button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-black text-white py-3.5 font-mono text-xs uppercase tracking-widest font-bold">
              {submitting ? 'Publishing...' : 'Publish Project'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-center py-12 font-mono text-xs text-neutral-400">Loading Portfolio...</div>
          ) : portfolios.length === 0 ? (
            <div className="border border-neutral-200 border-dashed bg-white p-16 text-center text-neutral-400 font-mono text-xs">No entries found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolios.map((item) => (
                <div key={item._id} className="bg-white border border-neutral-200/70 flex flex-col justify-between group">
                  <div className="aspect-video w-full bg-neutral-100 overflow-hidden relative">
                    <img src={item.images?.[0]} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-sm font-luxury text-black uppercase tracking-wider">{item.title}</h3>
                      <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <div>
                        <span className="block text-[8px] font-mono text-neutral-400 uppercase">Budget</span>
                        <span className="text-xs font-mono text-black font-bold">{item.priceRange || 'N/A'}</span>
                      </div>
                      <button onClick={() => handleDeleteItem(item._id)} className="text-neutral-400 hover:text-rose-600 font-mono text-[10px] flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};