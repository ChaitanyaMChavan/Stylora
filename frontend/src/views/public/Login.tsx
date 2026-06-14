import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { LogIn, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Direct integration call matching your standard schema spec
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data;
        login(token, user);

        // Intelligently vector the user to their unique premium panel role matrix
        if (user.role === 'admin') navigate('/admin/dashboard');
        else if (user.role === 'designer') navigate('/designer/dashboard');
        else navigate('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access denied. Please check your structural credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <Card className="w-full max-w-md bg-white p-8 space-y-6 border border-black/5 luxury-hover">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-luxury uppercase tracking-widest text-black">Sign In</h1>
          <p className="text-[10px] tracking-widest text-neutral-400 uppercase">Access your private workspace environment</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-[11px] uppercase tracking-wider font-semibold border border-red-100 flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Digital Mail (Email)</label>
            <input 
              type="email" 
              required
              className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-neutral-500 font-medium mb-1">Passphrase</label>
            <input 
              type="password" 
              required
              className="w-full border border-neutral-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="md" className="mt-2" disabled={isSubmitting}>
            <LogIn size={12} className="mr-1.5" /> {isSubmitting ? 'Verifying Verification Key...' : 'Authorize Entrance'}
          </Button>
        </form>

        <div className="text-center text-xs text-neutral-400 font-light pt-2">
          New to the house?{' '}
          <Link to="/register" className="text-black font-semibold uppercase tracking-wider underline underline-offset-4">
            Create Profile Registry
          </Link>
        </div>
      </Card>
    </div>
  );
};