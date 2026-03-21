import React, { useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { Users, Scale, MessageCircle, Bell, BookOpen, Settings, Sparkles, Star } from 'lucide-react';
import MentorsPage from './MentorsPage';
import JudgesPage from './JudgesPage';
import MessagesPage from './MessagesPage';
import ChatPage from './ChatPage';
import NotificationsPage from './NotificationsPage';
import ResourcesPage from './ResourcesPage';
import ReviewsPage from './ReviewsPage';
import SettingsPage from './SettingsPage';

const NAV_ITEMS = [
  { id: 'mentors', label: 'Mentors', icon: Users },
  { id: 'judges', label: 'Judges', icon: Scale },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const PAGE_COMPONENTS: Record<string, React.FC> = {
  mentors: MentorsPage,
  judges: JudgesPage,
  messages: MessagesPage,
  notifications: NotificationsPage,
  resources: ResourcesPage,
  reviews: ReviewsPage,
  settings: SettingsPage,
};

const AppShell = () => {
  const { activePage, setActivePage, currentUser, conversations, notifications } = useAppStore();
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const didSwipeRef = useRef(false);

  const unreadMsgs = conversations.filter(c => c.unread_by?.includes(currentUser?.email || '')).length;
  const unreadNotifs = notifications.filter(n => n.user_email === currentUser?.email && !n.read).length;

  const getBadge = (id: string) => {
    if (id === 'messages' && unreadMsgs > 0) return unreadMsgs;
    if (id === 'notifications' && unreadNotifs > 0) return unreadNotifs;
    return 0;
  };

  const pageIds = NAV_ITEMS.map(n => n.id);
  const currentIndex = pageIds.indexOf(activePage);
  const effectiveIndex = currentIndex >= 0 ? currentIndex : 0;

  // Disable swiping on settings page
  const isSettings = activePage === 'settings';

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isSettings) return;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setIsDragging(true);
    didSwipeRef.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [isSettings]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || isSettings) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    if (!didSwipeRef.current && Math.abs(dy) > Math.abs(dx)) {
      setIsDragging(false);
      return;
    }
    didSwipeRef.current = true;
    setDragOffset(dx);
  }, [isDragging, isSettings]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const trackWidth = trackRef.current?.offsetWidth || 400;
    const threshold = trackWidth * 0.15;

    if (Math.abs(dragOffset) > threshold) {
      const newIdx = dragOffset < 0
        ? Math.min(effectiveIndex + 1, pageIds.length - 1)
        : Math.max(effectiveIndex - 1, 0);
      setActivePage(pageIds[newIdx]);
    }
    setDragOffset(0);
  }, [isDragging, dragOffset, effectiveIndex, pageIds, setActivePage]);

  if (activePage === 'chat') return <ChatPage />;

  const baseTranslate = -(effectiveIndex * 100);
  const dragPct = trackRef.current ? (dragOffset / trackRef.current.offsetWidth) * 100 : 0;
  const translateX = Math.max(-(pageIds.length - 1) * 100, Math.min(0, baseTranslate + (isSettings ? 0 : dragPct)));

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - desktop */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col border-r border-border z-50" style={{ background: 'hsl(0 0% 100% / 0.94)', backdropFilter: 'blur(18px)' }}>
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
          <div className="mc-logo-icon"><Sparkles className="w-4 h-4 text-primary-foreground" /></div>
          <span className="font-display text-base text-foreground">Mentor Connect</span>
        </div>
        <div className="flex flex-col gap-1 p-3 flex-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const badge = getBadge(id);
            return (
              <button key={id} onClick={() => setActivePage(id)}
                className={`mc-nav-item ${activePage === id ? 'active' : ''}`}>
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={activePage === id ? 2.5 : 2} />
                <span>{label}</span>
                {badge > 0 && <span className="ml-auto bg-destructive text-destructive-foreground text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">{badge > 9 ? '9+' : badge}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main content - swipeable */}
      <main className="flex-1 md:pl-56 pb-20 md:pb-0 overflow-hidden" style={{ touchAction: 'pan-y' }}>
        {/* Swipe dots */}
        <div className="swipe-dots py-2 md:hidden">
          {NAV_ITEMS.map((item, i) => (
            <button key={item.id} onClick={() => setActivePage(item.id)} className="flex items-center gap-1 group">
              <div className={`swipe-dot ${effectiveIndex === i ? 'active' : ''}`} />
            </button>
          ))}
        </div>

        <div
          ref={trackRef}
          className={`flex ${isDragging ? '' : 'transition-transform duration-350'}`}
          style={{
            transform: `translateX(${translateX}%)`,
            transitionTimingFunction: 'var(--ease-smooth)',
            transitionDuration: isDragging ? '0ms' : '350ms',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {pageIds.map((id) => {
            const PageComponent = PAGE_COMPONENTS[id];
            return (
              <div key={id} className="min-w-full flex-shrink-0">
                <PageComponent />
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border z-50 flex justify-around py-1.5 px-1" style={{ background: 'hsl(0 0% 100% / 0.94)', backdropFilter: 'blur(18px)' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const badge = getBadge(id);
          return (
            <button key={id} onClick={() => setActivePage(id)}
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl text-[10px] font-medium transition-colors relative ${activePage === id ? 'text-primary' : 'text-muted-foreground'}`}>
              <Icon className="w-[18px] h-[18px]" strokeWidth={activePage === id ? 2.5 : 2} />
              <span>{label}</span>
              {badge > 0 && <span className="absolute -top-0.5 right-0 bg-destructive text-destructive-foreground text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">{badge > 9 ? '9+' : badge}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppShell;
