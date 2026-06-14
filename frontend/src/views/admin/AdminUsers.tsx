import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, User, Mail, Trash2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState([
    { uid: 'USR-901', name: 'Chaitanya Chavan', email: 'chaitanya@example.com', role: 'client', joiningDate: '2026-02-14', status: 'active' },
    { uid: 'USR-482', name: 'Maurice Lefevre', email: 'maurice@atelier.com', role: 'designer', joiningDate: '2026-01-08', status: 'active' },
    { uid: 'USR-112', name: 'Admin Terminal', email: 'root@stylora.com', role: 'admin', joiningDate: '2025-10-01', status: 'active' }
  ]);

  const toggleSuspend = (uid: string) => {
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  return (
    <div className="space-y-10 py-2 animate-fade-in">
      <div className="border-b border-black/5 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold">Identity Records</span>
          <h1 className="text-3xl font-luxury uppercase tracking-wide text-black">Global Users Grid</h1>
        </div>
        <span className="text-[10px] tracking-widest text-neutral-400 font-mono uppercase">Nodes Tracked: {users.length}</span>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.uid} className="bg-white p-6 border border-neutral-200/60 rounded-none shadow-none grid grid-cols-1 lg:grid-cols-12 gap-4 items-center luxury-hover">
            <div className="lg:col-span-3 space-y-0.5">
              <span className="text-[9px] font-mono text-neutral-400 block">{user.uid}</span>
              <h4 className="text-sm font-luxury uppercase text-black tracking-wider flex items-center gap-1.5">
                <User size={12} className="text-neutral-400" /> {user.name}
              </h4>
            </div>

            <div className="lg:col-span-3 text-xs font-mono text-neutral-600 flex items-center gap-1.5 truncate">
              <Mail size={12} className="text-neutral-400" />
              <span>{user.email}</span>
            </div>

            <div className="lg:col-span-3 text-xs font-mono space-y-0.5">
              <div className="text-neutral-400">Layer Security Classification:</div>
              <div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                  user.role === 'admin' ? 'bg-neutral-950 text-white border-black' :
                  user.role === 'designer' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-100">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 border ${
                user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {user.status}
              </span>

              {user.role !== 'admin' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`font-mono border-neutral-200 ${user.status === 'active' ? 'text-rose-700 hover:bg-rose-700 hover:text-white' : 'text-emerald-700 hover:bg-emerald-700 hover:text-white'}`}
                  onClick={() => toggleSuspend(user.uid)}
                >
                  {user.status === 'active' ? 'Suspend Node' : 'Activate Node'}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};