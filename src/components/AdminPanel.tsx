import React, { useState } from 'react';
import { useAppStore, User, isUserAdmin } from '@/store/appStore';
import { Shield, ChevronDown, Check, Trash2 } from 'lucide-react';

const ROLES: User['role'][] = ['mentor', 'judge', 'coach', 'teacher', 'admin'];

const AdminPanel = () => {
  const { users, currentUser, updateUser, deleteUser } = useAppStore();
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  if (!isUserAdmin(currentUser)) return null;

  const otherUsers = users.filter(u => u.id !== currentUser?.id);

  const handleRoleChange = (user: User, newRole: User['role']) => {
    updateUser({ ...user, role: newRole });
    setExpandedUser(null);
  };

  const handleDeleteUser = (user: User) => {
    if (!confirm(`Delete ${user.first_name} ${user.last_name}'s account? This cannot be undone.`)) return;
    deleteUser(user.id);
  };

  return (
    <div className="mc-card-subtle rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-2 flex items-center gap-2">
        <Shield className="w-[18px] h-[18px] text-primary" />
        <h2 className="font-semibold text-sm text-foreground">Admin — Manage Users</h2>
      </div>
      <div className="px-5 pb-5">
        <div className="space-y-2 mt-3">
          {otherUsers.map(user => (
            <div key={user.id} className="bg-muted rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="mc-avatar w-8 h-8 text-xs shrink-0">{user.first_name[0]}{user.last_name[0]}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize bg-secondary text-secondary-foreground hover:opacity-80 transition-colors"
                  >
                    {user.role}
                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedUser === user.id ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {expandedUser === user.id && (
                <div className="mt-2 flex flex-wrap gap-1.5" style={{ animation: 'mcFadeIn 0.2s ease both' }}>
                  {ROLES.map(role => (
                    <button key={role}
                      onClick={() => handleRoleChange(user, role)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        user.role === role
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border text-foreground hover:bg-muted'
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
