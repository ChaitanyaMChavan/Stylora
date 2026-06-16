import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { User, Mail, Loader2, AlertTriangle } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [targetUser, setTargetUser] = useState<any | null>(null);

  const fetchUsers = async () => {
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (response.data.success) setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token]);

  const commitToggleSuspend = async () => {
    if (!targetUser) return;
    try {
      const activeToken = token || localStorage.getItem('stylora_auth_token');
      const updatedStatus = targetUser.status === 'active' ? 'suspended' : 'active';
      
      // Update local state grid optimistically
      setUsers(prev => prev.map(u => u._id === targetUser._id ? { ...u, status: updatedStatus } : u));
      setTargetUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32 font-mono text-xs text-neutral-400">
        <Loader2 className="animate-spin text-[#D4AF37] mr-2" size={16} /> READ-STREAM DATA OVERHEAD PIPELINE ACTIVE...
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2 animate-fade-in relative">
      {targetUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border p-6 w-full max-w-sm font-mono text-xs">
            <div className="flex items-center gap-2 border-b pb-2 mb-4 text-black font-bold">
              <AlertTriangle size={14} className="text-[#D4AF37]" /> ALTER ACCOUNT CLEARANCE
            </div>
            <p className="text-neutral-500 mb-6 leading-relaxed">
              Confirm changing structural configuration state parameters for {targetUser.name}?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setTargetUser(null)} className="border px-3 py-1.5 uppercase tracking-wider text-[10px]">Abort</button>
              <button onClick={commitToggleSuspend} className="bg-black text-white px-3 py-1.5 uppercase tracking-wider text-[10px]">Execute Changes</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-black/5 pb-6">
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Network Domain Management</span>
        <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Registered Identity Directory</h1>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user._id} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-5 space-y-1 font-mono">
              <div className="flex items-center gap-2 text-black text-xs font-bold uppercase">
                <User size={13} className="text-[#D4AF37]" /> {user.name}
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                <Mail size={11} /> {user.email}
              </div>
            </div>

            <div className="lg:col-span-4 flex items-center">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 border ${
                user.role === 'admin' ? 'bg-neutral-950 text-white border-black' :
                user.role === 'designer' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {user.role}
              </span>
            </div>

            <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border ${
                user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {user.status || 'active'}
              </span>

              {/* {user.role !== 'admin' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTargetUser(user)}
                  className={`font-mono border-neutral-200 text-[10px] uppercase tracking-wider`}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </Button>
              )} */}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};