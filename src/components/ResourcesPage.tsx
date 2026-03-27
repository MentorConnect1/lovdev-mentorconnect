import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore, Resource, isUserAdmin } from '@/store/appStore';
import { BookOpen, Video, FileText, Link2, ExternalLink, X, Plus, ArrowLeft } from 'lucide-react';

const CAT_COLORS: Record<string, string> = {
  debate: 'bg-secondary text-secondary-foreground',
  public_speaking: 'bg-purple-100 text-purple-800',
  coaching: 'bg-emerald-100 text-emerald-800',
  judging: 'bg-orange-100 text-orange-800',
  general: 'bg-muted text-muted-foreground',
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  video: Video,
  document: FileText,
  link: Link2,
  default: BookOpen,
};

const ResourcesPage = () => {
  const { resources, currentUser, addResource } = useAppStore();
  const [catFilter, setCatFilter] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', description: '', url: '', category: 'debate', type: 'document' });

  const isAdmin = isUserAdmin(currentUser);
  const filtered = catFilter ? resources.filter(r => r.category === catFilter) : resources;

  const handleCreate = () => {
    if (!newResource.title.trim()) return;
    const resource: Resource = {
      id: `r_${Date.now()}`,
      title: newResource.title,
      description: newResource.description,
      url: newResource.url || undefined,
      category: newResource.category,
      type: newResource.type,
      posted_by_name: `${currentUser?.first_name} ${currentUser?.last_name}`,
      created_date: new Date().toISOString(),
    };
    addResource(resource);
    setNewResource({ title: '', description: '', url: '', category: 'debate', type: 'document' });
    setShowCreateForm(false);
  };

  if (selectedResource) {
    const Icon = TYPE_ICONS[selectedResource.type] || TYPE_ICONS.default;
    const catClass = CAT_COLORS[selectedResource.category] || CAT_COLORS.general;
    const dateStr = new Date(selectedResource.created_date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });

    return (
      <>
        <div className="mc-top-bar">
          <div className="px-5 py-4 md:px-6">
            <button onClick={() => setSelectedResource(null)} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Resources
            </button>
            <h1 className="font-display text-2xl text-foreground">{selectedResource.title}</h1>
          </div>
        </div>
        <div className="px-5 py-6 md:px-6">
          <div className="max-w-[700px] mx-auto">
            <div className="mc-card-subtle rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary stroke-[1.75]" />
                </div>
                <div>
                  <div className="flex gap-2">
                    <span className={`mc-badge ${catClass}`}>{(selectedResource.category || '').replace('_', ' ')}</span>
                    <span className="mc-badge border border-border text-primary bg-transparent">{selectedResource.type}</span>
                  </div>
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    {selectedResource.posted_by_name && <span>By {selectedResource.posted_by_name}</span>}
                    <span>{dateStr}</span>
                  </div>
                </div>
              </div>
              {selectedResource.description && (
                <p className="text-foreground leading-relaxed mb-4">{selectedResource.description}</p>
              )}
              {selectedResource.url && selectedResource.url !== '#' && (
                <a href={selectedResource.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                  style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                  <ExternalLink className="w-4 h-4" /> Open Resource
                </a>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h1 className="font-display text-2xl text-foreground">Resources</h1>
            </div>
            {isAdmin && (
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowCreateForm(true); }}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all relative z-[60]"
                style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                <Plus className="w-4 h-4" /> New
              </button>
            )}
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

      {showCreateForm && createPortal(
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowCreateForm(false)}
          onPointerDown={e => e.stopPropagation()}>
          <div className="mc-card p-6 w-full max-w-md" onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-foreground">New Resource</h2>
              <button onClick={() => setShowCreateForm(false)} className="p-1.5 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input className="mc-form-input" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} placeholder="Resource title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="mc-form-input resize-y min-h-[80px]" value={newResource.description} onChange={e => setNewResource({ ...newResource, description: e.target.value })} placeholder="What is this resource about?" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input className="mc-form-input" value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select className="mc-form-input" value={newResource.category} onChange={e => setNewResource({ ...newResource, category: e.target.value })}>
                    <option value="debate">Debate</option>
                    <option value="public_speaking">Public Speaking</option>
                    <option value="coaching">Coaching</option>
                    <option value="judging">Judging</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="mc-form-input" value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })}>
                    <option value="document">Document</option>
                    <option value="video">Video</option>
                    <option value="link">Link</option>
                  </select>
                </div>
              </div>
              <button onClick={handleCreate}
                onPointerDown={e => e.stopPropagation()}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all"
                style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
                Create Resource
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="px-5 py-5 md:px-6">
        <div className="max-w-[1100px] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3 stroke-[1.5]" />
              <p className="font-medium text-muted-foreground">No resources in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(r => {
                const Icon = TYPE_ICONS[r.type] || TYPE_ICONS.default;
                const catClass = CAT_COLORS[r.category] || CAT_COLORS.general;
                const dateStr = new Date(r.created_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <div key={r.id} className="mc-card-subtle rounded-2xl p-4 cursor-pointer" onClick={() => setSelectedResource(r)}>
                    <div className="flex gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary stroke-[1.75]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm text-foreground">{r.title}</h3>
                          {r.url && r.url !== '#' && (
                            <span className="text-primary shrink-0"><ExternalLink className="w-4 h-4" /></span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className={`mc-badge ${catClass}`}>{(r.category || '').replace('_', ' ')}</span>
                          <span className="mc-badge border border-border text-primary bg-transparent">{r.type}</span>
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
