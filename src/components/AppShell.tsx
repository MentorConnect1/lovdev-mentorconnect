import React, { useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { Users, Scale, MessageCircle, Bell, BookOpen, Settings, Sparkles, Star } from 'lucide-react';
import MentorsPage from './MentorsPage';
import JudgesPage from './JudgesPage';
import MessagesPage from './MessagesPage';
import ChatPage from './ChatPage';
import NotificationsPage from './NotificationsPage';
import ResourcesPage from './ResourcesPage';
import ReviewsPage from './ReviewsPage';
import SettingsPage from './SettingsPage';
import { useIsPhoneView } from './PhoneViewWrapper';

const NAV_ITEMS = [
  { id: 'mentors', label: 'Mentors', icon: Users },
  { id: 'judges', label: 'Judges', icon: Scale },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'notifications', label: 'Notifs', icon: Bell },
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
  const dragOffsetRef = useRef(0);
  const didSwipeRef = useRef(false);
  const isPhoneView = useIsPhoneView();
  const isViewportMobile = useIsMobile();
  const isMobileLayout = isPhoneView || isViewportMobile;

  const unreadMsgs = conversations.filter(c => c.unread_by?.includes(currentUser?.email || '')).length;
  const unreadNotifs = notifications.filter(n => n.user_email === currentUser?.email && !n.read).length;

  const getBadge = (id: string) => {
    if (id === 'messages' && unreadMsgs > 0) return unreadMsgs;
    if (id === 'notifications' && unreadNotifs > 0) return unreadNotifs;
    return 0;
  };

  const pageIds = NAV_ITEMS.map((n) => n.id);
  const currentIndex = pageIds.indexOf(activePage);
  const effectiveIndex = currentIndex >= 0 ? currentIndex : 0;

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'range') return;
    if (target.closest('input[type="range"]')) return;

    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(true);
    didSwipeRef.current = false;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    if (!didSwipeRef.current && Math.abs(dy) > Math.abs(dx)) {
      setIsDragging(false);
      dragOffsetRef.current = 0;
      setDragOffset(0);
      return;
    }

    didSwipeRef.current = true;
    dragOffsetRef.current = dx;
    setDragOffset(dx);
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    if (!isDragging) return;

    const finalOffset = dragOffsetRef.current;
    setIsDragging(false);

    const trackWidth = trackRef.current?.offsetWidth || 400;
    const threshold = Math.min(56, trackWidth * 0.1);

    if (Math.abs(finalOffset) > threshold) {
      const newIdx = finalOffset < 0
        ? Math.min(effectiveIndex + 1, pageIds.length - 1)
        : Math.max(effectiveIndex - 1, 0);
      setActivePage(pageIds[newIdx]);
    }

    dragOffsetRef.current = 0;
    setDragOffset(0);
  }, [isDragging, effectiveIndex, pageIds, setActivePage]);

  if (activePage === 'chat') return <ChatPage />;

  const pageWidth = trackRef.current?.offsetWidth || 1;
  const baseTranslate = -(effectiveIndex * 100);
  const dragPct = (dragOffset / pageWidth) * 100;
  const translateX = Math.max(-(pageIds.length - 1) * 100, Math.min(0, baseTranslate + dragPct));
  const showSidebar = !isMobileLayout;

  return (
    <div className={`relative min-h-screen ${isMobileLayout ? 'h-[100dvh] overflow-hidden' : ''}`}>
      {showSidebar && (
        <nav
          className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col border-r border-border z-50"
          style={{ background: 'hsl(var(--background) / 0.94)', backdropFilter: 'blur(18px)' }}
        >
          <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
            <div className="mc-logo-icon"><Sparkles className="w-4 h-4 text-primary-foreground" /></div>
            <span className="font-display text-base text-foreground">Mentor Connect</span>
          </div>
          <div className="flex flex-col gap-1 p-3 flex-1">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const badge = getBadge(id);
              const displayLabel = id === 'notifications' ? 'Notifications' : label;
              return (
                <button key={id} onClick={() => setActivePage(id)} className={`mc-nav-item ${activePage === id ? 'active' : ''}`}>
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={activePage === id ? 2.5 : 2} />
                  <span>{displayLabel}</span>
                  {badge > 0 && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-[11px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      <main
        className={`overflow-hidden ${showSidebar ? 'md:pl-56 min-h-screen' : 'h-full pb-16'}`}
        style={{ touchAction: 'pan-y' }}
      >
        <div
          ref={trackRef}
          className={`flex w-full h-full ${isDragging ? '' : 'transition-transform duration-300'}`}
          style={{
            transform: `translateX(${translateX}%)`,
            transitionTimingFunction: 'var(--ease-smooth)',
            transitionDuration: isDragging ? '0ms' : '300ms',
            willChange: 'transform',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {pageIds.map((id) => {
            const PageComponent = PAGE_COMPONENTS[id];
            return (
              <div key={id} className="w-full min-w-full h-full flex-shrink-0 overflow-y-auto overscroll-y-contain">
                <PageComponent />
              </div>
            );
          })}
        </div>
      </main>

      {isMobileLayout && (
        <nav
          className="absolute bottom-0 left-0 right-0 border-t border-border z-50 flex items-stretch h-16"
          style={{ background: 'hsl(var(--background) / 0.96)', backdropFilter: 'blur(18px)' }}
        >
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const badge = getBadge(id);
            return (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 text-[9px] font-medium transition-colors relative ${activePage === id ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={activePage === id ? 2.5 : 2} />
                <span className="truncate max-w-full leading-tight">{label}</span>
                {badge > 0 && (
                  <span className="absolute top-1 right-1/4 bg-destructive text-destructive-foreground text-[8px] font-bold min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default AppShell;
