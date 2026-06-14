import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2, XCircle, AlertCircle, Loader2, Check } from 'lucide-react';

interface NotificationLog {
  _id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  isRead: boolean;
  createdAt: string;
}

export const ClientNotifications: React.FC = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch live notifications from your specific backend route
  const fetchNotificationStream = async () => {
    try {
      setLoading(true);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      
      // Update this string path if your endpoint is something like /api/notifications/my
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      } else {
        setError('Could not securely pull update ledger alerts.');
      }
    } catch (err: any) {
      console.error('Error compiling notification channels:', err);
      setError(err.response?.data?.message || 'Unable to establish connection with the backend notification stream.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotificationStream();
  }, [token]);

  // 2. Optional: Trigger an update to mark a notification as read on the backend
  const handleMarkAsRead = async (id: string) => {
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      // Matches standard PUT/PATCH notification update endpoints
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      
      // Update state locally
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <div className="p-8 bg-[#FAFAFA] min-h-screen animate-fade-in">
      {/* Editorial Header Section */}
      <div className="mb-12 border-b border-neutral-200/60 pb-6 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold block mb-2">
            System Message Hub (Live API Connected)
          </span>
          <h1 className="text-3xl font-luxury uppercase tracking-wider text-black">
            Notifications
          </h1>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1">
          Active Transmissions: {String(notifications.length).padStart(2, '0')}
        </span>
      </div>

      {/* Logic Gates For Processing States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-neutral-400 font-mono text-[11px] tracking-widest bg-white border border-neutral-200/60">
          <Loader2 className="animate-spin text-[#D4AF37]" size={24} />
          <span>POLLING SECURE BACKEND NOTIFICATION STREAMS...</span>
        </div>
      ) : error ? (
        <div className="border border-rose-200 bg-rose-50/40 p-6 text-center max-w-xl mx-auto font-mono text-xs text-rose-900 tracking-wide flex items-center justify-center gap-2">
          <AlertCircle size={14} className="text-rose-600" />
          <span>{error}</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-16 text-center max-w-xl mx-auto rounded-none font-mono text-xs tracking-widest text-neutral-400">
          NO DATA LOGS DETECTED IN YOUR DATABASE NOTIFICATION ROUTE.
        </div>
      ) : (
        /* Real Database Notification List */
        <div className="space-y-4 max-w-4xl">
          {notifications.map((log) => (
            <div 
              key={log._id} 
              className={`bg-white border p-5 flex gap-4 items-start transition-all shadow-sm ${
                log.isRead ? 'border-neutral-200/50 opacity-70' : 'border-neutral-400/90 font-bold'
              }`}
            >
              {/* Dynamic Icon Node Column */}
              <div className="mt-1 flex-shrink-0">
                {log.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600" /> :
                 log.type === 'error' ? <XCircle size={18} className="text-rose-600" /> :
                 log.type === 'warning' ? <AlertCircle size={18} className="text-amber-500" /> :
                 <Bell size={18} className="text-[#D4AF37]" />}
              </div>

              {/* Message Context Block */}
              <div className="space-y-1 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="text-sm font-luxury uppercase tracking-wider text-black">
                    {log.title}
                  </h3>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-xs text-neutral-600 font-light leading-relaxed tracking-wide">
                  {log.message}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                    LOG ID: {log._id.slice(-6).toUpperCase()}
                  </span>

                  {!log.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(log._id)}
                      className="text-neutral-400 hover:text-black font-mono text-[9px] tracking-widest uppercase flex items-center gap-1"
                    >
                      <Check size={10} />
                      <span>Dismiss Log</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};