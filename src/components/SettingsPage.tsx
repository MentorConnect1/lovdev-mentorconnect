import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { Settings, User, Shield, LogOut, Trash2, Save, MapPin, GraduationCap, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
  const { currentUser, updateUser, logout, setActivePage } = useAppStore();
  const [panelIndex, setPanelIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const didSwipeRef = useRef(false);

  const [form, setForm] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    location: currentUser?.location || '',
    school: currentUser?.school || '',
    description: currentUser?.description || '',
    available_for_hire: currentUser?.available_for_hire ?? true,
  });
  const [saved, setSaved] = useState(false);

  const panelCount = 2; // Profile, Account

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

  // Pointer/touch swipe handling
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setIsDragging(true);
    didSwipeRef.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // If vertical scroll intent, cancel swipe
    if (!didSwipeRef.current && Math.abs(dy) > Math.abs(dx)) {
      setIsDragging(false);
      return;
    }
    didSwipeRef.current = true;
    setDragOffset(dx);
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const trackWidth = trackRef.current?.offsetWidth || 400;
    const threshold = trackWidth * 0.15; // 15% threshold

    if (Math.abs(dragOffset) > threshold) {
      const newIdx = dragOffset < 0
        ? Math.min(panelIndex + 1, panelCount - 1)
        : Math.max(panelIndex - 1, 0);
      setPanelIndex(newIdx);
    }
    setDragOffset(0);
  }, [isDragging, dragOffset, panelIndex]);

  // Calculate transform
  const baseTranslate = -(panelIndex * 100);
  const dragPct = trackRef.current ? (dragOffset / trackRef.current.offsetWidth) * 100 : 0;
  const translateX = baseTranslate + dragPct;

  // Clamp to prevent over-scrolling
  const clampedTranslateX = Math.max(-(panelCount - 1) * 100, Math.min(0, translateX));

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Settings</h1>
          </div>
          {/* Swipe dots instead of tabs */}
          <div className="swipe-dots mt-3">
            {['Profile', 'Account'].map((label, i) => (
              <button key={i} onClick={() => setPanelIndex(i)} className="flex items-center gap-1.5 group">
                <div className={`swipe-dot ${panelIndex === i ? 'active' : ''}`} />
                <span className={`text-xs font-medium transition-colors ${panelIndex === i ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              </button>
            ))}
          </div>
          {/* Swipe hint */}
          <div className="flex items-center justify-center gap-1 mt-1 text-[11px] text-mc-400">
            <ChevronLeft className="w-3 h-3" />
            <span>Swipe to navigate</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden" style={{ touchAction: 'pan-y' }}>
        {saved && (
          <div className="mx-5 mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm" style={{ animation: 'mcSlideIn 0.25s ease both' }}>
            <Save className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        <div
          ref={trackRef}
          className={`settings-track ${isDragging ? 'dragging' : ''}`}
          style={{ transform: `translateX(${clampedTranslateX}%)` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Panel 0: Profile */}
          <div className="settings-panel">
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
          </div>

          {/* Panel 1: Account */}
          <div className="settings-panel">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
