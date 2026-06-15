import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Bell, ShieldAlert, CreditCard, Calendar, CheckCircle2, Loader2 } from 'lucide-react';

interface NotificationData {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Deriving unread count directly from your actual backend data payload arrays
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      if (!activeToken) return;

      // Matches router.get("/", protect, getMyNotifications) mounted on /api/notifications
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (err) {
      console.error('Failed to parse active notification index:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polls every 30s
    return () => clearInterval(interval);
  }, [token]);

  // Fix 1: Matches router.put("/read-all", protect, markAllNotificationsRead)
  const handleMarkAllRead = async () => {
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      const response = await axios.put('http://localhost:5000/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to commit notification index update:', err);
    }
  };

  // Fix 2: Handles clicking a single item matching router.put("/:id/read", protect, markNotificationRead)
  const handleMarkSingleRead = async (id: string, alreadyRead: boolean) => {
    if (alreadyRead) return; // Ignore if already read
    
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      const response = await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });

      if (response.data.success) {
        setNotifications(prev => 
          prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );
      }
    } catch (err) {
      console.error('Failed to update individual notification state:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'payment':
        return <CreditCard size={14} className="text-[#D4AF37]" />;
      case 'appointment':
        return <Calendar size={14} className="text-black" />;
      default:
        return <ShieldAlert size={14} className="text-neutral-400" />;
    }
  };

  return (
    <div className="relative font-mono text-[11px]">
      {/* Trigger Button */}
      <button 
        onClick={() => { setIsOpen(!isOpen); if(!isOpen) fetchNotifications(); }}
        className="relative p-2 text-neutral-600 hover:text-black transition-colors focus:outline-none"
      >
        <Bell size={18} strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-bold h-4 w-4 rounded-none flex items-center justify-center border border-white tracking-tighter">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Layout Box */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 bg-white border border-neutral-200 shadow-xl z-50 animate-scale-up transform origin-top-right">
            
            <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-[#FAFAFA]">
              <span className="font-bold tracking-widest uppercase text-black">Alert Roster</span>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllRead}
                  className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 size={10} /> Clear Unread
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100">
              {loading && notifications.length === 0 ? (
                <div className="p-6 text-center text-neutral-400 flex justify-center items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-[#D4AF37]" />
                  <span>SYNCING RECORDS...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 tracking-wider">
                  LEDGER INBOX CLEAR.
                </div>
              ) : (
                notifications.map((note) => (
                  <div 
                    key={note._id} 
                    onClick={() => handleMarkSingleRead(note._id, note.isRead)}
                    className={`p-4 transition-colors flex gap-3 items-start cursor-pointer ${
                      !note.isRead ? 'bg-[#FAFAFA] border-l-2 border-black hover:bg-neutral-50' : 'bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    <div className="mt-0.5 border border-neutral-200 p-1 bg-white">
                      {getTypeIcon(note.type)}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center">
                        <span className={`uppercase tracking-wide ${!note.isRead ? 'font-bold text-black' : 'text-neutral-500'}`}>
                          {note.title}
                        </span>
                        <span className="text-[8px] text-neutral-400">
                          {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-500 text-[10px] tracking-normal leading-normal font-sans">
                        {note.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};