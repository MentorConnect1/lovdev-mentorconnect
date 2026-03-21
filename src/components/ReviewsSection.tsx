import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Star, ThumbsUp, Quote } from 'lucide-react';

const ReviewsSection = () => {
  const reviews = useAppStore(s => s.reviews);

  // Only show front_page approved reviews on landing, fallback to first 3 if none approved
  const frontPageReviews = reviews.filter(r => r.front_page);
  const displayReviews = frontPageReviews.length > 0 ? frontPageReviews.slice(0, 3) : reviews.slice(0, 3);

  const avgSatisfaction = reviews.length > 0
    ? Math.round(reviews.reduce((sum, r) => sum + r.satisfaction_pct, 0) / reviews.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="mc-card p-5">
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
        <p className="text-xs text-muted-foreground mt-2">Based on {reviews.length} reviews from mentors, students, and coaches</p>
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {displayReviews.map((review, i) => (
          <div key={review.id} className="mc-review-card" style={{ animationDelay: `${(i + 3) * 80}ms` }}>
            <div className="flex items-start gap-3">
              <div className="mc-avatar w-9 h-9 text-xs">{review.user_name.split(' ').map(n => n[0]).join('')}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-foreground">{review.user_name}</span>
                    <span className="mc-badge-role ml-2 text-[10px]">{review.user_role}</span>
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
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  <span className="text-xs font-semibold" style={{ color: `hsl(${review.satisfaction_pct > 90 ? '142 71% 45%' : '221 83% 53%'})` }}>
                    {review.satisfaction_pct}% satisfied
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
