import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store/appStore';
import { ChevronLeft, Sparkles, Users, Scale, BookOpen, GraduationCap, Check, Eye, EyeOff, Search, X } from 'lucide-react';
import { US_STATES, COUNTRIES, SCHOOLS } from '@/data/locations';

const ROLES = [
  { id: 'mentor', icon: Users, title: 'Mentor', desc: 'Guide and teach others in debate' },
  { id: 'judge', icon: Scale, title: 'Judge', desc: 'Evaluate debates and competitions' },
  { id: 'coach', icon: BookOpen, title: 'Coach', desc: "Coach your school's team & recruit" },
  { id: 'teacher', icon: GraduationCap, title: 'Teacher', desc: 'Educate students in schools' },
] as const;

// Autocomplete dropdown component
const AutocompleteInput = ({ label, required, placeholder, value, onChange, suggestions }: {
  label: string; required?: boolean; placeholder: string; value: string;
  onChange: (v: string) => void; suggestions: string[];
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const filtered = useMemo(() => {
    if (!query) return suggestions.slice(0, 50);
    const q = query.toLowerCase();
    return suggestions.filter(s => s.toLowerCase().includes(q)).slice(0, 30);
  }, [query, suggestions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium mb-1">{label}{required && ' *'}</label>
      <div className="relative">
        <input
          className="mc-form-input pr-8"
          placeholder={placeholder}
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button onClick={() => { setQuery(''); onChange(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-mc-200 bg-card shadow-lg">
          {filtered.map(s => (
            <button key={s} onClick={() => { onChange(s); setQuery(s); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-mc-50 transition-colors truncate">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SignupFlow = () => {
  const { setActivePage, setCurrentUser, addUser, users } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [form, setForm] = useState({ first: '', last: '', email: '', password: '', country: 'United States', state: '', school: '' });
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Fake email verification
  const [verifyStep, setVerifyStep] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const locationLabel = form.country === 'United States' ? form.state : form.country;

  const handleSignup = () => {
    if (!form.first || !form.last || !form.email || !form.password || !form.country) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.country === 'United States' && !form.state) {
      setError('Please select your state.'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (users.find(u => u.email === form.email.toLowerCase().trim())) { setError('Account already exists.'); return; }

    // Generate 6-digit code and show verification
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code);
    setVerifyStep(true);
    setVerifyError('');
    setCodeInput('');
  };

  const handleVerify = () => {
    if (codeInput !== generatedCode) {
      setVerifyError('Incorrect code. Please try again.');
      return;
    }

    const location = form.country === 'United States' ? form.state : form.country;
    const user = {
      id: 'u_' + Date.now(),
      email: form.email.toLowerCase().trim(),
      password: form.password,
      first_name: form.first,
      last_name: form.last,
      role: selectedRole as any,
      location,
      school: form.school || undefined,
      description: '',
      available_for_hire: selectedRole !== 'coach',
      email_verified: true,
    };
    addUser(user);
    setCurrentUser(user);
    setActivePage('mentors');
  };

  // Email verification screen
  if (verifyStep) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-7 mc-reveal">
            <div className="mc-logo-icon-lg mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl tracking-tight text-foreground">Verify Email</h1>
          </div>
          <div className="mc-card mc-reveal mc-reveal-delay-1 p-6">
            <p className="text-sm text-muted-foreground mb-2">We sent a verification code to <span className="font-semibold text-foreground">{form.email}</span></p>

            {/* Show the code prominently (fake verification) */}
            <div className="bg-mc-50 border-2 border-dashed border-mc-300 rounded-xl p-4 text-center mb-5">
              <p className="text-xs text-muted-foreground mb-1">Your verification code</p>
              <p className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">{generatedCode}</p>
            </div>

            {verifyError && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm mb-3">{verifyError}</div>}

            <label className="block text-sm font-medium mb-1">Enter 6-digit code</label>
            <input
              className="mc-form-input text-center text-xl font-mono tracking-[0.3em] mb-4"
              maxLength={6}
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              autoFocus
            />

            <button onClick={handleVerify} disabled={codeInput.length !== 6}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
              style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
              Verify & Create Account
            </button>

            <button onClick={() => setVerifyStep(false)} className="w-full text-center text-sm text-muted-foreground mt-3 hover:text-foreground transition-colors">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <button onClick={() => step === 1 ? setActivePage('landing') : setStep(1)} className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground transition-colors mb-3">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-display text-2xl text-foreground">Create an account</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Step {step} of 2 — {step === 1 ? 'Choose your role' : <>Signing up as <span className="font-semibold text-primary capitalize">{selectedRole}</span></>}
            </p>
          </div>

          <div className="p-6">
            {step === 1 ? (
              <div className="space-y-2.5">
                {ROLES.map(({ id, icon: Icon, title, desc }) => (
                  <button key={id} onClick={() => setSelectedRole(id)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${selectedRole === id ? 'border-primary bg-secondary' : 'border-border bg-card hover:border-muted-foreground/30 hover:bg-secondary/50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedRole === id ? 'bg-primary' : 'bg-muted'}`}>
                      <Icon className={`w-5 h-5 ${selectedRole === id ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    {selectedRole === id && <Check className="w-5 h-5 text-primary shrink-0" />}
                  </button>
                ))}
                <button disabled={!selectedRole} onClick={() => { setError(''); setStep(2); }}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm mt-4 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                  style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                  Continue
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm">{error}</div>}
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1">First Name *</label><input className="mc-form-input" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium mb-1">Last Name *</label><input className="mc-form-input" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" className="mc-form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} className="mc-form-input pr-10" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AutocompleteInput
                  label="Country"
                  required
                  placeholder="Select country"
                  value={form.country}
                  onChange={v => setForm({ ...form, country: v, state: '' })}
                  suggestions={COUNTRIES}
                />

                {form.country === 'United States' && (
                  <AutocompleteInput
                    label="State"
                    required
                    placeholder="Select state"
                    value={form.state}
                    onChange={v => setForm({ ...form, state: v })}
                    suggestions={US_STATES}
                  />
                )}

                <AutocompleteInput
                  label="School"
                  placeholder="Search for your school (optional)"
                  value={form.school}
                  onChange={v => setForm({ ...form, school: v })}
                  suggestions={SCHOOLS}
                />

                <button onClick={handleSignup}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                  Create Account
                </button>
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <button onClick={() => setActivePage('login')} className="text-primary font-semibold hover:underline">Log in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
