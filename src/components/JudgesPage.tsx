import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import PersonCard from './PersonCard';
import { Scale, Search, MapPin } from 'lucide-react';
import { LOCATIONS } from '@/data/locations';

const JudgesPage = () => {
  const { users, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const judges = users.filter(u => u.role === 'judge' && u.email_verified && u.email !== currentUser?.email);
  const judgeLocations = [...new Set(judges.map(j => j.location).filter(Boolean))] as string[];

  // All possible locations from data + existing judge locations
  const allLocations = [...new Set([...LOCATIONS, ...judgeLocations])].sort();
  const filteredLocations = locationSearch
    ? allLocations.filter(l => l.toLowerCase().includes(locationSearch.toLowerCase())).slice(0, 30)
    : allLocations.slice(0, 30);

  const filtered = judges.filter(j => {
    const matchQ = `${j.first_name} ${j.last_name} ${j.description || ''}`.toLowerCase().includes(search.toLowerCase());
    return matchQ && (!locationFilter || j.location === locationFilter);
  });

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Judges</h1>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input className="mc-form-input pl-9" placeholder="Search judges…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="relative w-full">
              <div className="relative w-full">
                <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  className="mc-form-input pl-9 w-full"
                  placeholder="Filter by location…"
                  value={locationSearch || locationFilter}
                  onChange={e => { setLocationSearch(e.target.value); setLocationFilter(''); setShowLocationDropdown(true); }}
                  onFocus={() => setShowLocationDropdown(true)}
                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                />
                {locationFilter && (
                  <button onClick={() => { setLocationFilter(''); setLocationSearch(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <span className="text-xs">✕</span>
                  </button>
                )}
              </div>
              {showLocationDropdown && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                  {filteredLocations.map(loc => (
                    <button key={loc}
                      onMouseDown={() => { setLocationFilter(loc); setLocationSearch(''); setShowLocationDropdown(false); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-xl last:rounded-b-xl truncate">
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[1100px] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No judges found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(p => <PersonCard key={p.id} person={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JudgesPage;
