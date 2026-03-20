import React, { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { BookOpen, Video, FileText, Link2, ExternalLink } from 'lucide-react';

const CAT_COLORS: Record<string, string> = {
  debate: 'bg-mc-100 text-mc-800',
  public_speaking: 'bg-purple-100 text-purple-800',
  coaching: 'bg-emerald-100 text-emerald-800',
  judging: 'bg-orange-100 text-orange-800',
  general: 'bg-gray-100 text-gray-700',
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  document: FileText,
  link: Link2,
  default: BookOpen,
};

const ResourcesPage = () => {
  const { resources } = useAppStore();
  const [catFilter, setCatFilter] = useState('');

  const filtered = catFilter ? resources.filter(r => r.category === catFilter) : resources;

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Resources</h1>
          </div>
          <div className="mt-3">
            <select className="mc-form-input w-auto" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option value="">All Categories</option>
              <option value="debate">Debate</option>
              <option value="public_speaking">Public Speaking</option>
              <option value="coaching">Coaching</option>
              <option value="judging">Judging</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[1100px]">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-mc-300 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No resources in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map(r => {
                const Icon = TYPE_ICONS[r.type] || TYPE_ICONS.default;
                const catClass = CAT_COLORS[r.category] || CAT_COLORS.general;
                const dateStr = new Date(r.created_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <div key={r.id} className="mc-card-subtle rounded-2xl p-4">
                    <div className="flex gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-mc-100 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary stroke-[1.75]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm text-foreground">{r.title}</h3>
                          {r.url && r.url !== '#' && (
                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary shrink-0">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className={`mc-badge ${catClass}`}>{(r.category || '').replace('_', ' ')}</span>
                          <span className="mc-badge border border-mc-200 text-primary bg-transparent">{r.type}</span>
                        </div>
                        {r.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{r.description}</p>}
                        <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                          {r.posted_by_name && <span>By {r.posted_by_name}</span>}
                          <span>{dateStr}</span>
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

export default ResourcesPage;
