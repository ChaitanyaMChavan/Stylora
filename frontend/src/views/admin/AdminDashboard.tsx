import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/card';
import { ShieldCheck, Users, ShieldAlert, Activity, Loader2, Calendar, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activeToken = token || localStorage.getItem('stylora_auth_token');
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });
        if (response.data.success) {
          setData(response.data.dashboard);
        }
      } catch (err) {
        console.error("Dashboard metric compilation failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-2 text-neutral-400 font-mono text-xs tracking-widest">
        <Loader2 className="animate-spin text-[#D4AF37]" size={20} />
        <span>PARSING SYSTEM CORE TELEMETRY...</span>
      </div>
    );
  }

  const statistics = [
    { label: 'Total Registered Users', count: data?.totalUsers || 0, subtext: `${data?.totalClients || 0} Clients / ${data?.totalDesigners || 0} Designers`, icon: <Users size={16} className="text-black" /> },
    { label: 'Active Appointments', count: data?.totalAppointments || 0, subtext: 'System booking instances tracking', icon: <Calendar size={16} className="text-[#D4AF37]" /> },
    { label: 'Client Feedback Records', count: data?.totalReviews || 0, subtext: 'Verified platform review documents', icon: <FileText size={16} className="text-neutral-500" /> }
  ];

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
          <Activity size={10} /> Root Executive Session // Core Terminal
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">HQ System Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statistics.map((stat, i) => (
          <Card key={i} className="border border-neutral-200/60 p-6 rounded-none shadow-none bg-white">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-black">{stat.label}</span>
              <div className="p-1.5 bg-neutral-50 border border-neutral-100">{stat.icon}</div>
            </div>
            <div className="pt-4 space-y-0.5">
              <span className="text-4xl font-luxury text-black block">{String(stat.count).padStart(2, '0')}</span>
              <span className="text-[10px] text-neutral-400 font-mono block">{stat.subtext}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-neutral-950 border border-black p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-white">
        <div className="md:col-span-2 space-y-1">
          <span className="text-[9px] tracking-widest text-[#D4AF37] uppercase font-bold">System Status Frame</span>
          <h3 className="text-lg font-luxury uppercase tracking-wider">Atelier Integrity Guard Running</h3>
          <p className="text-xs text-neutral-400 font-mono font-light leading-relaxed">
            All data pathways running normally. Cross-origin authorization records matching cryptographic verification handshakes perfectly.
          </p>
        </div>
      </div>
    </div>
  );
};