import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Settings, User, Shield, LogOut, Trash2, Save, Mail } from 'lucide-react';
import AdminPanel from './AdminPanel';

const SettingsPage = () => {
  const { currentUser, updateUser, logout, setActivePage } = useAppStore();

  const isAdmin = currentUser?.email === 'ethav31@gmail.com';

  const [form, setForm] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    location: currentUser?.location || '',
    school: currentUser?.school || '',
    description: currentUser?.description || '',
    available_for_hire: currentUser?.available_for_hire ?? true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!currentUser) return;
    updateUser({ ...currentUser, ...form });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    setActivePage('landing');
  };

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Settings</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 md:px-6 space-y-5 max-w-[700px]">
        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm" style={{ animation: 'mcSlideIn 0.25s ease both' }}>
            <Save className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        {/* Profile */}
        <div className="mc-card-subtle rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <User className="w-[18px] h-[18px] text-primary" />
            <h2 className="font-semibold text-sm text-foreground">Profile Information</h2>
          </div>
          <div className="px-5 pb-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="mc-avatar mc-avatar-lg">{(currentUser?.first_name || '?')[0]}{(currentUser?.last_name || '?')[0]}</div>
              <div>
                <p className="font-semibold text-foreground">{currentUser?.first_name} {currentUser?.last_name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{currentUser?.email}</p>
                <span className="mc-badge-role mt-1 text-[10px]">{currentUser?.role}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1">First Name</label><input className="mc-form-input" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
                <div><label className="block text-sm font-medium mb-1">Last Name</label><input className="mc-form-input" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Location</label><input className="mc-form-input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              {(currentUser?.role === 'mentor' || currentUser?.role === 'coach' || currentUser?.role === 'teacher') && (
                <div><label className="block text-sm font-medium mb-1">School</label><input className="mc-form-input" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} /></div>
              )}
              <div><label className="block text-sm font-medium mb-1">About You</label><textarea className="mc-form-input resize-y min-h-[96px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              {currentUser?.role !== 'coach' && (
                <div className="flex items-center justify-between bg-mc-50 rounded-xl p-4">
                  <div>
                    <p className="font-medium text-sm text-foreground">Available for hire</p>
                    <p className="text-xs text-muted-foreground">Let others know you're available</p>
                  </div>
                  <label className="mc-toggle">
                    <input type="checkbox" checked={form.available_for_hire} onChange={e => setForm({ ...form, available_for_hire: e.target.checked })} />
                    <span className="mc-toggle-slider" />
                  </label>
                </div>
              )}
              <button onClick={handleSave}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="mc-card-subtle rounded-2xl overflow-hidden">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <Shield className="w-[18px] h-[18px] text-primary" />
            <h2 className="font-semibold text-sm text-foreground">Account</h2>
          </div>
          <div className="px-5 pb-5 space-y-3">
            <div className="flex items-center justify-between bg-mc-50 rounded-xl p-4">
              <div>
                <p className="font-medium text-sm text-foreground">Email Verified</p>
                <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
              </div>
              <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 L9 17 L4 12" /></svg>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-destructive/30 text-destructive font-semibold text-sm hover:bg-destructive/5 transition-colors active:scale-[0.98]">
              <LogOut className="w-4 h-4" /> Log Out
            </button>
            <button
              onClick={() => { if (confirm('Delete your account? This cannot be undone.')) { logout(); setActivePage('landing'); } }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-destructive/30 text-destructive font-semibold text-sm hover:bg-destructive/5 transition-colors active:scale-[0.98]">
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>

        {/* Admin */}
        {isAdmin && <AdminPanel />}
      </div>
    </>
  );
};

export default SettingsPage;
