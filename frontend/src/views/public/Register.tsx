import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { api } from '../../services/api';
import { UserPlus, ShieldAlert, CheckCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'designer'>('client');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      
      if (response.data.success) {
        setSuccess('Profile successfully cataloged! Redirecting to lookbook login vault...');
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration stalled. Email may already possess credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <Card className="w-full max-w-md bg-white p-8 space-y-6 border border-black/5 luxury-hover">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-luxury uppercase tracking-widest text-black">Join The House</h1>
          <p className="text-[10px] tracking-widest text-neutral-400 uppercase">Establish your persistent profile credentials</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-[11px] uppercase tracking-wider font-semibold border border-red-100 flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" /> {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-700 text-[11px] uppercase tracking-wider font-semibold border border-emerald-100 flex items-center gap-2">
            <CheckCircle size={14} className="shrink-0" /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Full Legal Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
              placeholder="Chaitanya Chavan"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Digital Mail (Email)</label>
            <input 
              type="email" 
              required
              className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
              placeholder="chaitanya@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Secure Passphrase</label>
            <input 
              type="password" 
              required
              className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Ecosystem Workspace Role</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <button
                type="button"
                className={`py-2 text-center text-xs font-medium uppercase tracking-widest border transition-all cursor-pointer ${role === 'client' ? 'border-black bg-black text-white' : 'border-neutral-200 text-neutral-500 hover:border-black/30'}`}
                onClick={() => setRole('client')}
              >
                Client Space
              </button>
              <button
                type="button"
                className={`py-2 text-center text-xs font-medium uppercase tracking-widest border transition-all cursor-pointer ${role === 'designer' ? 'border-black bg-black text-white' : 'border-neutral-200 text-neutral-500 hover:border-black/30'}`}
                onClick={() => setRole('designer')}
              >
                Atelier Master
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="md" className="mt-4" disabled={isSubmitting}>
            <UserPlus size={12} className="mr-1.5" /> {isSubmitting ? 'Registering Structural Unit...' : 'Commit Registry Portfolio'}
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400 font-light pt-1">
          Already belong to the atelier?{' '}
          <Link to="/login" className="text-black font-semibold uppercase tracking-wider underline underline-offset-4">
            Authorize Entry
          </Link>
        </div>
      </Card>
    </div>
  );
};