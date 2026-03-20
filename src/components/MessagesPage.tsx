import React from 'react';
import { useAppStore } from '@/store/appStore';
import { MessageCircle, EyeOff, ChevronRight } from 'lucide-react';

const MessagesPage = () => {
  const { conversations, currentUser, setActivePage, setActiveConvoId, hideConvo, markConvoRead } = useAppStore();
  const visibleConvos = conversations
    .filter(c => c.participants.includes(currentUser?.email || '') && !c.hidden_by?.includes(currentUser?.email || ''))
    .sort((a, b) => new Date(b.last_message_date).getTime() - new Date(a.last_message_date).getTime());

  const openChat = (convoId: string) => {
    markConvoRead(convoId);
    setActiveConvoId(convoId);
    setActivePage('chat');
  };

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Messages</h1>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[700px]">
          {visibleConvos.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-mc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-mc-400 mt-1">Start by messaging a mentor or judge</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleConvos.map(c => {
                const otherEmail = c.participants.find(e => e !== currentUser?.email) || '';
                const otherName = c.participant_names?.[otherEmail] || otherEmail;
                const initials = otherName.split(' ').map(n => n[0]).join('').slice(0, 2);
                const unread = c.unread_by?.includes(currentUser?.email || '');
                const dateStr = c.last_message_date ? new Date(c.last_message_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '';

                return (
                  <div key={c.id} onClick={() => openChat(c.id)}
                    className={`mc-card-subtle rounded-2xl px-4 py-3.5 cursor-pointer ${unread ? 'bg-mc-50/60' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="mc-avatar mc-avatar-sm">{initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm text-foreground ${unread ? 'font-bold' : 'font-semibold'}`}>{otherName}</span>
                          <span className="text-xs text-muted-foreground">{dateStr}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className={`text-sm truncate max-w-[200px] ${unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                            {c.last_message || 'No messages yet'}
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            {unread && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            <button onClick={e => { e.stopPropagation(); hideConvo(c.id); }} className="p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                              <EyeOff className="w-4 h-4" />
                            </button>
                            <ChevronRight className="w-4 h-4 text-mc-400" />
                          </div>
                        </div>
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

export default MessagesPage;
