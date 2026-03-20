import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { ChevronLeft, Sparkles, Users, Scale, BookOpen, GraduationCap, Check, Eye, EyeOff } from 'lucide-react';

const ROLES = [
  { id: 'mentor', icon: Users, title: 'Mentor', desc: 'Guide and teach others in debate' },
  { id: 'judge', icon: Scale, title: 'Judge', desc: 'Evaluate debates and competitions' },
  { id: 'coach', icon: BookOpen, title: 'Coach', desc: "Coach your school's team & recruit" },
  { id: 'teacher', icon: GraduationCap, title: 'Teacher', desc: 'Educate students in schools' },
] as const;

const SignupFlow = () => {
  const { setActivePage, setCurrentUser, addUser, users } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [form, setForm] = useState({ first: '', last: '', email: '', password: '', location: '', school: '' });
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const handleSignup = () => {
    if (!form.first || !form.last || !form.email || !form.password || !form.location) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (users.find(u => u.email === form.email.toLowerCase().trim())) { setError('Account already exists.'); return; }

    const user = {
      id: 'u_' + Date.now(),
      email: form.email.toLowerCase().trim(),
      password: form.password,
      first_name: form.first,
      last_name: form.last,
      role: selectedRole as any,
      location: form.location,
      school: form.school || undefined,
      description: '',
      available_for_hire: selectedRole !== 'coach',
      email_verified: true,
    };
    addUser(user);
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
            <button onClick={() => step === 1 ? setActivePage('landing') : setStep(1)} className="flex items-center gap-1 text-mc-400 text-sm hover:text-mc-700 transition-colors mb-3">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-display text-2xl text-foreground">Create an account</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Step {step} of 2 — {step === 1 ? 'Choose your role' : <>Signing up as <span className="font-semibold text-mc-700 capitalize">{selectedRole}</span></>}
            </p>
          </div>

          <div className="p-6">
            {step === 1 ? (
              <div className="space-y-2.5">
                {ROLES.map(({ id, icon: Icon, title, desc }) => (
                  <button key={id} onClick={() => setSelectedRole(id)}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${selectedRole === id ? 'border-primary bg-mc-50' : 'border-mc-100 bg-card hover:border-mc-300 hover:bg-mc-50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selectedRole === id ? 'bg-primary' : 'bg-mc-100'}`}>
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
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mc-400"><Eye className="w-4 h-4" /></button>
                  </div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Location *</label><input className="mc-form-input" placeholder="e.g. California" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
                <div><label className="block text-sm font-medium mb-1">School</label><input className="mc-form-input" placeholder="Your school (optional)" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} /></div>
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
