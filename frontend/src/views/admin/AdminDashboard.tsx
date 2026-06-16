import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/card';
import { Users, Activity, Loader2, Calendar, FileText, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

// Custom Interactive Tooltip matching the luxury theme
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-950 text-white p-3 border border-neutral-800 font-mono text-[10px] space-y-1.5 shadow-xl">
        <p className="text-[#D4AF37] font-bold border-b border-neutral-800 pb-1 mb-1 uppercase tracking-wider">{label}</p>
        <p className="flex justify-between gap-6">
          <span className="text-neutral-400">APPOINTMENTS:</span> 
          <span className="font-bold text-white">{payload[0].value}</span>
        </p>
        {payload[1] && (
          <p className="flex justify-between gap-6">
            <span className="text-neutral-400">NEW REGISTRATIONS:</span> 
            <span className="font-bold text-white">{payload[1].value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock historical data array structured dynamically to scale with your backend counts
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activeToken = token || localStorage.getItem('stylora_auth_token');
        const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });
        
        if (response.data.success) {
          const dashboard = response.data.dashboard;
          setData(dashboard);

          // Dynamically scale historical visual metrics relative to database records
          const totalAppointments = dashboard?.totalAppointments || 0;
          const totalUsers = dashboard?.totalUsers || 0;

          setChartData([
            { month: 'JAN', appointments: Math.round(totalAppointments * 0.3), users: Math.round(totalUsers * 0.2) },
            { month: 'FEB', appointments: Math.round(totalAppointments * 0.4), users: Math.round(totalUsers * 0.3) },
            { month: 'MAR', appointments: Math.round(totalAppointments * 0.6), users: Math.round(totalUsers * 0.5) },
            { month: 'APR', appointments: Math.round(totalAppointments * 0.5), users: Math.round(totalUsers * 0.7) },
            { month: 'MAY', appointments: Math.round(totalAppointments * 0.8), users: Math.round(totalUsers * 0.8) },
            { month: 'JUN', appointments: totalAppointments, users: totalUsers },
          ]);
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
    { 
      label: 'Total Registered Users', 
      count: data?.totalUsers || 0, 
      subtext: `${data?.totalClients || 0} Clients / ${data?.totalDesigners || 0} Designers`, 
      icon: <Users size={16} className="text-black" /> 
    },
    { 
      label: 'Active Appointments', 
      count: data?.totalAppointments || 0, 
      subtext: 'System booking instances tracking', 
      icon: <Calendar size={16} className="text-[#D4AF37]" /> 
    },
    { 
      label: 'Client Feedback Records', 
      count: data?.totalReviews || 0, 
      subtext: 'Verified platform review documents', 
      icon: <FileText size={16} className="text-neutral-500" /> 
    }
  ];

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      {/* Editorial System Header */}
      <div className="border-b border-black/5 pb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">
          <Activity size={10} /> Root Executive Session // Core Terminal
        </div>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">HQ System Overview</h1>
        <p className="text-xs text-neutral-400 font-mono font-light">Global platform telemetry ledger and data management station.</p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statistics.map((stat, i) => (
          <Card key={i} className="border border-neutral-200/60 p-6 rounded-none shadow-none bg-white flex flex-col justify-between transition-all duration-300 hover:border-black/30">
            <div className="flex justify-between items-start gap-4">
              <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-black">{stat.label}</span>
              <div className="p-1.5 bg-neutral-50 border border-neutral-100">{stat.icon}</div>
            </div>
            <div className="pt-6 space-y-0.5">
              <span className="text-4xl font-luxury text-black block">{String(stat.count).padStart(2, '0')}</span>
              <span className="text-[10px] text-neutral-400 font-mono block">{stat.subtext}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Interactive Platform Metrics Graph Block */}
      <div className="bg-white border border-neutral-200/60 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">
              <TrendingUp size={11} /> Performance Vectors
            </div>
            <h3 className="text-lg font-luxury uppercase tracking-wider text-black">
              Platform Operations Ledger
            </h3>
          </div>
          
          {/* Legend Toggles */}
          <div className="flex gap-4 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              <span className="text-neutral-600 uppercase tracking-wider">Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-0.5 bg-black border-t-2 border-b-2 border-black border-dashed" />
              <span className="text-neutral-600 uppercase tracking-wider">User Growth</span>
            </div>
          </div>
        </div>

        {/* Recharts Graphical Core */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="luxuryGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                stroke="#a3a3a3" 
                fontSize={10} 
                fontFamily="monospace" 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#a3a3a3" 
                fontSize={10} 
                fontFamily="monospace" 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0a0a0a', strokeWidth: 0.5, strokeDasharray: '3 3' }} />
              <CartesianGrid stroke="#f5f5f5" vertical={false} />
              
              {/* Main Booking Area Metric */}
              <Area 
                type="monotone" 
                dataKey="appointments" 
                stroke="#D4AF37" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#luxuryGold)" 
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
              
              {/* Secondary User Growth Trendline */}
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#0a0a0a" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};