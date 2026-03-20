import React from 'react';
import { useAppStore, User } from '@/store/appStore';
import { MapPin, GraduationCap, MessageCircle, Check, EyeOff } from 'lucide-react';

const PersonCard = ({ person }: { person: User }) => {
  const { currentUser, conversations, setActivePage, setActiveConvoId, addConversation, unhideConvo, hideConvo } = useAppStore();
  const initials = `${(person.first_name || '?')[0]}${(person.last_name || '?')[0]}`;

  const existingConvo = conversations.find(c =>
    c.participants.includes(currentUser?.email || '') && c.participants.includes(person.email)
  );
  const isHidden = existingConvo?.hidden_by?.includes(currentUser?.email || '');

  const startOrOpenConvo = () => {
    if (existingConvo) {
      if (isHidden) unhideConvo(existingConvo.id);
      setActiveConvoId(existingConvo.id);
      setActivePage('chat');
      return;
    }
    const convo = {
      id: 'c_' + Date.now(),
      participants: [currentUser!.email, person.email],
      participant_names: { [currentUser!.email]: `${currentUser!.first_name} ${currentUser!.last_name}`, [person.email]: `${person.first_name} ${person.last_name}` },
      last_message: '',
      last_message_date: new Date().toISOString(),
      unread_by: [],
      hidden_by: [],
    };
    addConversation(convo);
    setActiveConvoId(convo.id);
    setActivePage('chat');
  };

  return (
    <div className="mc-card-subtle rounded-2xl p-5 relative overflow-hidden group">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-mc-400 to-mc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex items-start gap-4 mb-3">
        <div className="mc-avatar mc-avatar-md">{initials}</div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-base text-foreground leading-tight">{person.first_name} {person.last_name}</div>
          <span className="mc-badge-role mt-1">{person.role}</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {person.location && <span className="mc-meta-pill"><MapPin className="w-3 h-3" />{person.location}</span>}
            {person.school && <span className="mc-meta-pill"><GraduationCap className="w-3 h-3" />{person.school}</span>}
          </div>
        </div>
      </div>

      {person.description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{person.description}</p>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-mc-50">
        <div className="flex gap-2 items-center flex-wrap">
          {person.available_for_hire ? (
            <span className="mc-badge-available">Available</span>
          ) : (
            <span className="mc-badge-unavailable">Unavailable</span>
          )}
          {person.tabroom_linked && (
            <span className="mc-badge" style={{ background: 'hsl(var(--mc-green-50))', color: 'hsl(142 76% 26%)', border: '1px solid hsl(142 76% 72%)' }}>
              <Check className="w-3 h-3" /> Tabroom
            </span>
          )}
        </div>

        {person.available_for_hire && (
          <div className="flex gap-2">
            <button onClick={startOrOpenConvo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              style={{ boxShadow: '0 2px 10px hsl(221 83% 53% / 0.3)' }}>
              <MessageCircle className="w-3.5 h-3.5" />
              {existingConvo && !isHidden ? 'Open' : existingConvo && isHidden ? 'Reopen' : 'Message'}
            </button>
            {existingConvo && !isHidden && (
              <button onClick={(e) => { e.stopPropagation(); hideConvo(existingConvo.id); }}
                className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-mc-200 text-mc-600 text-xs font-semibold hover:bg-mc-50 transition-colors active:scale-[0.97]">
                <EyeOff className="w-3.5 h-3.5" /> Hide
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
