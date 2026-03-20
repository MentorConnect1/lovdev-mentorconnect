import React, { useState } from 'react';
import { useAppStore, User } from '@/store/appStore';
import { Shield, Users, ChevronDown, Check } from 'lucide-react';

const ROLES: User['role'][] = ['mentor', 'judge', 'coach', 'teacher', 'admin'];

const AdminPanel = () => {
  const { users, currentUser, updateUser } = useAppStore();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (currentUser?.email !== 'ethav31@gmail.com') return null;

  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  const handleRoleChange = (user: User, newRole: User['role']) => {
    updateUser({ ...user, role: newRole });
    setExpandedUser(null);
  };

  return (
    <div className="mc-card-subtle rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-2 flex items-center gap-2">
        <Shield className="w-[18px] h-[18px] text-primary" />
        <h2 className="font-semibold text-sm text-foreground">Admin — Manage Roles</h2>
      </div>
      <div className="px-5 pb-5">
        <div className="space-y-2 mt-3">
          {otherUsers.map(user => (
            <div key={user.id} className="bg-mc-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="mc-avatar w-8 h-8 text-xs">{user.first_name[0]}{user.last_name[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize bg-mc-100 text-mc-700 hover:bg-mc-200 transition-colors"
                >
                  {user.role}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expandedUser === user.id ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {expandedUser === user.id && (
                <div className="mt-2 flex flex-wrap gap-1.5" style={{ animation: 'mcFadeIn 0.2s ease both' }}>
                  {ROLES.map(role => (
                    <button key={role}
                      onClick={() => handleRoleChange(user, role)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        user.role === role
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white border border-mc-200 text-foreground hover:bg-mc-50'
                      }`}>
                      {user.role === role && <Check className="w-3 h-3" />}
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
