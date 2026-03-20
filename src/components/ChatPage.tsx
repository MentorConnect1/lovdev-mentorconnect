import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { ChevronLeft, Send } from 'lucide-react';

const ChatPage = () => {
  const { currentUser, conversations, messages, activeConvoId, setActivePage, addMessage, markConvoRead } = useAppStore();
  const [text, setText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const convo = conversations.find(c => c.id === activeConvoId);
  const msgs = activeConvoId ? messages[activeConvoId] || [] : [];
  const otherEmail = convo?.participants.find(e => e !== currentUser?.email) || '';
  const otherName = convo?.participant_names?.[otherEmail] || otherEmail;
  const initials = otherName.split(' ').map(n => n[0]).join('').slice(0, 2);

  useEffect(() => {
    if (activeConvoId) markConvoRead(activeConvoId);
  }, [activeConvoId]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [msgs.length]);

  const send = () => {
    if (!text.trim() || !activeConvoId) return;
    addMessage(activeConvoId, {
      id: 'm_' + Date.now(),
      from: currentUser!.email,
      text: text.trim(),
      created_date: new Date().toISOString(),
    });
    setText('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="mc-top-bar">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => setActivePage('messages')} className="text-mc-400 hover:text-mc-700 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="mc-avatar mc-avatar-sm">{initials}</div>
          <div>
            <h2 className="font-semibold text-sm text-foreground">{otherName}</h2>
            <p className="text-xs text-muted-foreground capitalize">{convo?.participant_names?.[otherEmail]?.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {msgs.map(msg => {
          const isMine = msg.from === currentUser?.email;
          const time = new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[74%] inline-flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                <div className={`inline-block px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card text-foreground rounded-bl-sm shadow-sm'}`}>
                  {msg.text}
                </div>
                <span className={`text-[11px] mt-1 ${isMine ? 'text-mc-400' : 'text-mc-400'}`}>{time}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-mc-100 px-4 py-3 flex gap-2.5 items-end" style={{ background: 'hsl(0 0% 100% / 0.92)', backdropFilter: 'blur(14px)' }}>
        <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Type a message…" rows={1}
          className="mc-form-input resize-none max-h-24 flex-1" />
        <button onClick={send} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-mc-700 transition-colors active:scale-[0.95]">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
