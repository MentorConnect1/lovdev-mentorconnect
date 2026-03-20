import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import PersonCard from './PersonCard';
import { Users, Search } from 'lucide-react';

const MentorsPage = () => {
  const { users, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const mentors = users.filter(u => u.role === 'mentor' && u.email_verified && u.email !== currentUser?.email);
  const locations = [...new Set(mentors.map(m => m.location).filter(Boolean))];

  const filtered = mentors.filter(m => {
    const matchQ = `${m.first_name} ${m.last_name} ${m.description || ''}`.toLowerCase().includes(search.toLowerCase());
    return matchQ && (!locationFilter || m.location === locationFilter);
  });

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Mentors</h1>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 text-mc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input className="mc-form-input pl-9" placeholder="Search mentors…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="mc-form-input w-auto" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {locations.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[1100px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-mc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No mentors found</p>
              <p className="text-sm text-mc-400 mt-1">Try a different search</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(p => <PersonCard key={p.id} person={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MentorsPage;
