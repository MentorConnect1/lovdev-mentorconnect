import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Bell, MessageCircle, UserPlus, BookOpen, Check, Trash2 } from 'lucide-react';

const NOTIF_ICONS: Record<string, React.ElementType> = {
  message: MessageCircle,
  hire_request: UserPlus,
  new_resource: BookOpen,
  default: Bell,
};

const NotificationsPage = () => {
  const { notifications, currentUser, markNotifRead, markAllNotifsRead, deleteNotification, setActivePage, setActiveConvoId } = useAppStore();
  const myNotifs = notifications.filter(n => n.user_email === currentUser?.email).sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const handleClick = (id: string) => {
    const n = myNotifs.find(x => x.id === id);
    if (!n) return;
    if (!n.read) markNotifRead(id);
    if ((n.type === 'message' || n.type === 'hire_request') && n.reference_id) {
      setActiveConvoId(n.reference_id);
      setActivePage('chat');
    } else if (n.type === 'new_resource') setActivePage('resources');
  };

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Notifications</h1>
            {unreadCount > 0 && <span className="mc-badge bg-mc-100 text-mc-800">{unreadCount}</span>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllNotifsRead} className="text-sm text-primary font-medium hover:underline">Mark all</button>
          )}
        </div>
      </div>
      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[700px] mx-auto">
          {myNotifs.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-mc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-mc-400 mt-1">You'll see updates here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myNotifs.map(n => {
                const Icon = NOTIF_ICONS[n.type] || NOTIF_ICONS.default;
                const dateStr = new Date(n.created_date).toLocaleDateString([], { month: 'short', day: 'numeric' });
                return (
                  <div key={n.id} onClick={() => handleClick(n.id)}
                    className={`mc-card-subtle rounded-2xl px-4 py-3.5 cursor-pointer ${!n.read ? 'bg-mc-50/60' : ''}`}>
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-primary' : 'bg-mc-100'}`}>
                        <Icon className={`w-4 h-4 ${!n.read ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-sm text-foreground">{n.title}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-muted-foreground">{dateStr}</span>
                            {!n.read && (
                              <button onClick={e => { e.stopPropagation(); markNotifRead(n.id); }} className="p-1 rounded-lg hover:bg-mc-50 text-mc-400 transition-colors">
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={e => { e.stopPropagation(); deleteNotification(n.id); }} className="p-1 rounded-lg hover:bg-destructive/10 text-mc-400 hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                        {n.from_user_name && <p className="text-xs text-mc-400 mt-1">From: {n.from_user_name}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
