import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import PersonCard from './PersonCard';
import { Scale, Search } from 'lucide-react';

const JudgesPage = () => {
  const { users, currentUser } = useAppStore();
  const [search, setSearch] = useState('');

  const judges = users.filter(u => u.role === 'judge' && u.email_verified && u.email !== currentUser?.email);
  const filtered = judges.filter(j => `${j.first_name} ${j.last_name} ${j.description || ''}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Judges</h1>
          </div>
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-mc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input className="mc-form-input pl-9" placeholder="Search judges…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[1100px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 text-mc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No judges found</p>
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

export default JudgesPage;
