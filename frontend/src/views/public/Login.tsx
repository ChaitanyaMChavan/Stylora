import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Shield, ShieldAlert, KeyRound, Mail, ArrowUpRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const targetAction = await loginUser(email, password);

    if (targetAction.success) {
      // Redirect directly to the correct workflow dashboard role mapping framework
      if (targetAction.role === 'admin') navigate('/admin');
      else if (targetAction.role === 'designer') navigate('/designer');
      else navigate('/client');
    } else {
      setErrorMsg(targetAction.error || 'Authentication transmission failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 animate-fade-in">
      <Card className="w-full max-w-md bg-white p-8 border border-neutral-200/60 rounded-none shadow-none space-y-6">
        
        {/* Visual Brand Identity Row */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-neutral-950 text-white border border-black rounded-none mb-1">
            <Shield size={20} className="text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-luxury uppercase tracking-wider text-black">Atelier Credentials</h1>
          <p className="text-xs text-neutral-400 font-mono">Input secure entry signature matrix</p>
        </div>

        {/* Display System Error Alert Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-mono flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Interactive Processing Engine */}
        <form onSubmit={handleFormSubmission} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold flex items-center gap-1">
              <Mail size={10} /> Account Identity Address
            </label>
            <input 
              type="email" 
              required 
              className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black bg-neutral-50/30 rounded-none font-mono"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] tracking-widest uppercase text-neutral-400 font-bold flex items-center gap-1">
              <KeyRound size={10} /> Access Keyphrase
            </label>
            <input 
              type="password" 
              required 
              className="w-full border border-neutral-200 p-3 text-xs focus:outline-none focus:border-black bg-neutral-50/30 rounded-none font-mono"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isSubmitting}
            className="pt-3.5 pb-3.5"
          >
            {isSubmitting ? 'Verifying Gateway...' : 'Authorize Signature'}
          </Button>
        </form>

        {/* Alternate Navigation Redirect Node */}
        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-[11px] font-mono text-neutral-400">
            Unregistered Identity signature?{' '}
            <Link to="/register" className="text-black font-bold hover:underline inline-flex items-center gap-0.5">
              Create Account <ArrowUpRight size={10} />
            </Link>
          </p>
        </div>

      </Card>
    </div>
  );
};