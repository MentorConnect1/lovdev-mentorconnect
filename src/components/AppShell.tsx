import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Users, Scale, MessageCircle, Bell, BookOpen, Settings, Sparkles } from 'lucide-react';
import MentorsPage from './MentorsPage';
import JudgesPage from './JudgesPage';
import MessagesPage from './MessagesPage';
import ChatPage from './ChatPage';
import NotificationsPage from './NotificationsPage';
import ResourcesPage from './ResourcesPage';
import SettingsPage from './SettingsPage';

const NAV_ITEMS = [
  { id: 'mentors', label: 'Mentors', icon: Users },
  { id: 'judges', label: 'Judges', icon: Scale },
  { id: 'messages', label: 'Messages', icon: MessageCircle },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AppShell = () => {
  const { activePage, setActivePage, currentUser, conversations, notifications } = useAppStore();

  const unreadMsgs = conversations.filter(c => c.unread_by?.includes(currentUser?.email || '')).length;
  const unreadNotifs = notifications.filter(n => n.user_email === currentUser?.email && !n.read).length;

  const getBadge = (id: string) => {
    if (id === 'messages' && unreadMsgs > 0) return unreadMsgs;
    if (id === 'notifications' && unreadNotifs > 0) return unreadNotifs;
    return 0;
  };

  if (activePage === 'chat') return <ChatPage />;

  const renderPage = () => {
    switch (activePage) {
      case 'mentors': return <MentorsPage />;
      case 'judges': return <JudgesPage />;
      case 'messages': return <MessagesPage />;
      case 'notifications': return <NotificationsPage />;
      case 'resources': return <ResourcesPage />;
      case 'settings': return <SettingsPage />;
      default: return <MentorsPage />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - desktop */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 flex-col border-r border-mc-100 z-50" style={{ background: 'hsl(0 0% 100% / 0.94)', backdropFilter: 'blur(18px)' }}>
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-mc-100">
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

      {/* Main content */}
      <main className="flex-1 md:pl-56 pb-20 md:pb-0">
        <div style={{ animation: 'mcFadeIn 0.28s ease both' }} key={activePage}>
          {renderPage()}
        </div>
      </main>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-mc-100 z-50 flex justify-around py-1.5 px-1" style={{ background: 'hsl(0 0% 100% / 0.94)', backdropFilter: 'blur(18px)' }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const badge = getBadge(id);
          return (
            <button key={id} onClick={() => setActivePage(id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[11px] font-medium transition-colors relative ${activePage === id ? 'text-mc-700' : 'text-mc-400'}`}>
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
