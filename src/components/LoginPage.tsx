import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { ChevronLeft, Sparkles, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const { setActivePage, setCurrentUser, users } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = () => {
    const user = users.find(u => u.email === email.toLowerCase().trim() && u.password === password);
    if (!user) { setError('Invalid email or password.'); return; }
    setCurrentUser(user);
    setActivePage('mentors');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-7 mc-reveal">
          <div className="mc-logo-icon-lg mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">Mentor Connect</h1>
        </div>

        <div className="mc-card mc-reveal mc-reveal-delay-1">
          <div className="p-6 pb-0">
            <button onClick={() => setActivePage('landing')} className="flex items-center gap-1 text-mc-400 text-sm hover:text-mc-700 transition-colors mb-3">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-display text-2xl text-foreground">Welcome back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
          </div>
          <div className="p-6">
            {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" className="mc-form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} className="mc-form-input pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mc-400 hover:text-mc-700 transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]" style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                Log In
              </button>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Don't have an account?{' '}
                <button onClick={() => setActivePage('signup')} className="text-primary font-semibold hover:underline">Sign up</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
