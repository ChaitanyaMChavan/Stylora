import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, ShieldAlert, Loader2, User } from 'lucide-react';

export const AdminDesigners: React.FC = () => {
  const { token } = useAuth();
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchDesigners = async () => {
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      const response = await axios.get('http://localhost:5000/api/admin/designers', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (response.data.success) {
        setStudios(response.data.designers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDesigners(); }, [token]);

  const changeStatus = async (id: string, nextStatus: 'verified' | 'rejected') => {
    try {
      setActionId(id);
      // Update entry state listing optimistically
      setStudios(prev => prev.map(s => s._id === id ? { ...s, status: nextStatus } : s));
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 font-mono text-xs text-neutral-400">
        <Loader2 className="animate-spin text-[#D4AF37] mr-2" size={16} /> STRUCTURING CREDENTIAL CHECKS...
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Atelier Security Clearance</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Verified Designers Board</h1>
      </div>

      <div className="space-y-4">
        {studios.map((studio) => (
          <Card key={studio._id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 lg:grid-cols-12 gap-4 items-center font-mono text-xs">
            <div className="lg:col-span-3 space-y-1">
              <span className="text-[9px] text-neutral-400 block">DSG-{studio._id.slice(-5).toUpperCase()}</span>
              <h3 className="text-sm font-bold text-black uppercase tracking-wider">{studio.brandName || 'Atelier House'}</h3>
            </div>

            <div className="lg:col-span-3 space-y-0.5">
              <span className="text-[9px] uppercase text-neutral-400 block">Lead Principal</span>
              <div className="flex items-center gap-1 text-neutral-700 font-bold"><User size={11} /> {studio.userId?.name || 'Designer Representative'}</div>
            </div>

            <div className="lg:col-span-3 space-y-0.5">
              <span className="text-[9px] uppercase text-neutral-400 block">Operational Location</span>
              <span className="text-black uppercase">{studio.location || 'Global Base'}</span>
            </div>

            <div className="lg:col-span-3 flex justify-end gap-2">
              <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border ${
                studio.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                studio.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {studio.status === 'verified' ? <ShieldCheck size={10} /> : <ShieldAlert size={10} />}
                {studio.status || 'pending'}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};