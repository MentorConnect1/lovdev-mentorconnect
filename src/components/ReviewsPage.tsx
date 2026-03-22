import React, { useState } from 'react';
import { useAppStore, Review, isUserAdmin } from '@/store/appStore';
import { Star, MessageSquarePlus, ThumbsUp, Quote, Crown, Pencil, Trash2, X } from 'lucide-react';

const ReviewsPage = () => {
  const { reviews, currentUser, addReview, updateReview, deleteReview, approveReviewForFrontPage, removeReviewFromFrontPage, addNotification } = useAppStore();
  const isAdmin = isUserAdmin(currentUser);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState(95);

  const startEdit = (review: Review) => {
    setEditingReview(review);
    setRating(review.rating);
    setText(review.text);
    setSatisfaction(review.satisfaction_pct);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!text.trim() || !currentUser) return;
    if (editingReview) {
      updateReview({ ...editingReview, rating, text: text.trim(), satisfaction_pct: satisfaction });
      setEditingReview(null);
    } else {
      const review: Review = {
        id: 'rv_' + Date.now(),
        user_name: `${currentUser.first_name} ${currentUser.last_name}`,
        user_email: currentUser.email,
        user_role: currentUser.role,
        rating,
        text: text.trim(),
        date: new Date().toISOString().split('T')[0],
        satisfaction_pct: satisfaction,
        front_page: false,
      };
      addReview(review);
    }
    setText('');
    setRating(5);
    setSatisfaction(95);
    setShowForm(false);
  };

  const handleApprove = (reviewId: string) => {
    const review = reviews.find(r => r.id === reviewId);
    if (!review) return;
    approveReviewForFrontPage(reviewId);
    if (review.user_email) {
      addNotification({
        id: 'n_' + Date.now(),
        user_email: review.user_email,
        type: 'default',
        title: '⭐ Review Featured!',
        message: 'Your review has been selected for the front page! Thank you for your feedback.',
        read: false,
        created_date: new Date().toISOString(),
      });
    }
  };

  const handleRemoveFromFrontPage = (reviewId: string) => {
    removeReviewFromFrontPage(reviewId);
  };

  const handleDelete = (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    deleteReview(reviewId);
  };

  const avgSatisfaction = reviews.length > 0
    ? Math.round(reviews.reduce((sum, r) => sum + r.satisfaction_pct, 0) / reviews.length)
    : 0;

  const allReviews = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const isOwnReview = (review: Review) => review.user_email === currentUser?.email;

  return (
    <>
      <div className="mc-top-bar">
        <div className="px-5 py-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl text-foreground">Reviews</h1>
          </div>
          <button onClick={() => { setEditingReview(null); setText(''); setRating(5); setSatisfaction(95); setShowForm(f => !f); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}>
            <MessageSquarePlus className="w-4 h-4" /> Write Review
          </button>
        </div>
      </div>

      <div className="px-5 py-5 md:px-6 max-w-[700px] mx-auto">
        {showForm && (
          <div className="mc-card p-5 mb-5" style={{ animation: 'mcSlideIn 0.25s ease both' }}>
            <h3 className="font-display text-lg text-foreground mb-3">{editingReview ? 'Edit Review' : 'Write a Review'}</h3>

            <div className="flex items-center gap-1 mb-3">
              <span className="text-sm font-medium mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}>
                  <Star className={`w-6 h-6 transition-colors ${i <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                </button>
              ))}
            </div>

            <div className="mb-3" onPointerDown={e => e.stopPropagation()}>
              <label className="text-sm font-medium">Satisfaction: {satisfaction}%</label>
              <input type="range" min="0" max="100" value={satisfaction}
                onChange={e => setSatisfaction(Number(e.target.value))}
                onPointerDown={e => e.stopPropagation()}
                className="w-full mt-1 accent-primary" />
            </div>

            <textarea
              className="mc-form-input resize-y min-h-[80px] mb-3"
              placeholder="Share your experience..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={!text.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40 transition-all hover:-translate-y-0.5 active:scale-[0.98]">
                {editingReview ? 'Save Changes' : 'Submit Review'}
              </button>
              <button onClick={() => { setShowForm(false); setEditingReview(null); }}
                className="px-4 py-2.5 rounded-xl border-2 border-border text-muted-foreground font-semibold text-sm hover:bg-muted/50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mc-card p-5 mb-5">
          <div className="flex items-center gap-3 mb-3">
            <ThumbsUp className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg text-foreground">Community Satisfaction</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-foreground font-display">{avgSatisfaction}%</span>
            <span className="text-sm text-muted-foreground">would recommend</span>
          </div>
          <div className="mc-satisfaction-bar">
            <div className="mc-satisfaction-fill" style={{ width: `${avgSatisfaction}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Based on {reviews.length} reviews</p>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {allReviews.map((review, i) => (
            <div key={review.id} className={`mc-review-card ${review.front_page ? 'ring-2 ring-amber-400/50' : ''}`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start gap-3">
                <div className="mc-avatar w-9 h-9 text-xs shrink-0">{review.user_name.split(' ').map(n => n[0]).join('')}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-foreground">{review.user_name}</span>
                      <span className="mc-badge-role text-[10px]">{review.user_role}</span>
                      {review.front_page && <span className="mc-badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px]"><Crown className="w-3 h-3" /> Featured</span>}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    <Quote className="w-3 h-3 inline text-muted mr-1 -mt-0.5" />
                    {review.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span className="text-xs font-semibold" style={{ color: `hsl(${review.satisfaction_pct > 90 ? '142 71% 45%' : '221 83% 53%'})` }}>
                        {review.satisfaction_pct}% satisfied
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {/* User's own review actions */}
                      {isOwnReview(review) && (
                        <>
                          <button onClick={() => startEdit(review)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(review.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {/* Admin actions */}
                      {isAdmin && (
                        <>
                          {!review.front_page ? (
                            <button onClick={() => handleApprove(review.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors border border-amber-200">
                              <Crown className="w-3 h-3" /> Feature
                            </button>
                          ) : (
                            <button onClick={() => handleRemoveFromFrontPage(review.id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors border border-border">
                              <X className="w-3 h-3" /> Unfeature
                            </button>
                          )}
                          {!isOwnReview(review) && (
                            <button onClick={() => handleDelete(review.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete review">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
