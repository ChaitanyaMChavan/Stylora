import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API } from '../../services/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Shield, ShieldAlert, User, Mail, KeyRound, ArrowUpRight, CheckCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'designer'>('client');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      // Dispatches form payload directly to your backend registration API endpoint
      await API.post('/auth/register', {
        name,
        email,
        password,
        role
      });

      setSuccess(true);
      setIsSubmitting(false);
      
      // Auto-redirect to credentials verification layer after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration pipeline rejected your input.';
      setErrorMsg(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 animate-fade-in">
      <Card className="w-full max-w-md bg-white p-8 border border-neutral-200/60 rounded-none shadow-none space-y-6">
        
        {/* Visual Brand Identity */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-neutral-950 text-white border border-black rounded-none mb-1">
            <Shield size={20} className="text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-luxury uppercase tracking-wider text-black">Create Account</h1>
          <p className="text-xs text-neutral-400 font-mono">Register new system user signature node</p>
        </div>

        {/* Success Alert Window */}
        {success && (
          <div className="p-3 bg-neutral-950 text-white text-xs font-mono flex items-center gap-2 border border-[#D4AF37]">
            <CheckCircle size={14} className="text-[#D4AF37] shrink-0" />
            <span>Registration complete! Routing to authorization desk...</span>
          </div>
        )}

        {/* Error Alert Window */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-mono flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Interactive Form Engine */}
        <form onSubmit={handleRegistrationSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold flex items-center gap-1">
              <User size={10} /> Full Legal Name
            </label>
            <input 
              type="text" 
              required 
              className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black bg-neutral-50/30 rounded-none font-mono"
              placeholder="e.g. Chaitanya Chavan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting || success}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold flex items-center gap-1">
              <Mail size={10} /> Email Identity Address
            </label>
            <input 
              type="email" 
              required 
              className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black bg-neutral-50/30 rounded-none font-mono"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || success}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold flex items-center gap-1">
              <KeyRound size={10} /> Select Account Role
            </label>
            <select 
              className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black bg-white rounded-none font-mono"
              value={role}
              onChange={(e) => setRole(e.target.value as 'client' | 'designer')}
              disabled={isSubmitting || success}
            >
              <option value="client">Client (Seek Design Commissions)</option>
              <option value="designer">Designer House (Exhibit Architecture Lookbooks)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold flex items-center gap-1">
              <KeyRound size={10} /> Establish Access Keyphrase
            </label>
            <input 
              type="password" 
              required 
              className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black bg-neutral-50/30 rounded-none font-mono"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || success}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isSubmitting || success}
            className="pt-3.5 pb-3.5"
          >
            {isSubmitting ? 'Registering Identity Core...' : 'Generate System Signature'}
          </Button>
        </form>

        {/* Redirect Bridge Link */}
        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-[11px] font-mono text-neutral-400">
            Already have a signed certificate?{' '}
            <Link to="/login" className="text-black font-bold hover:underline inline-flex items-center gap-0.5">
              Sign In <ArrowUpRight size={10} />
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
};