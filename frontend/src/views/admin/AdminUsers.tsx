import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { UserCheck, ShieldAlert } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 'USR-76', name: 'John Doe', email: 'john@example.com', role: 'client', status: 'active' },
    { id: 'USR-12', name: 'Eleanor Vance', email: 'eleanor@studio.com', role: 'designer', status: 'active' },
    { id: 'USR-04', name: 'Sarah Connor', email: 'sarah@penthouses.com', role: 'client', status: 'suspended' }
  ]);

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' } : user
    ));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-luxury text-black uppercase tracking-wide">Users Master Ledger</h1>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mt-0.5">Control global credential records</p>
      </div>

      <Card className="p-0 overflow-hidden bg-white border border-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-[10px] uppercase tracking-widest text-neutral-400 border-b border-neutral-100 font-bold">
                <th className="p-4">User ID</th>
                <th className="p-4">Identity Details</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Status Token</th>
                <th className="p-4 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-neutral-400">{user.id}</td>
                  <td className="p-4">
                    <div className="font-semibold uppercase tracking-wide text-black">{user.name}</div>
                    <div className="text-neutral-400 text-[11px] font-light">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${user.role === 'designer' ? 'text-[#D4AF37]' : 'text-neutral-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 border ${user.status === 'active' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all ${user.status === 'active' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                    >
                      {user.status === 'active' ? <ShieldAlert size={12} /> : <UserCheck size={12} />}
                      {user.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};