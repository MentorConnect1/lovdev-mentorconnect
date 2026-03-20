import React from 'react';
import { useAppStore } from '@/store/appStore';
import { Sparkles, LogIn, UserPlus, Users, Scale, BookOpen, GraduationCap, Star, ArrowRight } from 'lucide-react';
import ReviewsSection from './ReviewsSection';

const LandingPage = () => {
  const setActivePage = useAppStore(s => s.setActivePage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7 mc-reveal">
          <div className="mc-logo-icon-lg mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl tracking-tight text-foreground">Mentor Connect</h1>
          <p className="text-muted-foreground text-sm mt-1">The mentoring community hub</p>
        </div>

        {/* Auth Card */}
        <div className="mc-card p-6 mc-reveal mc-reveal-delay-1">
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActivePage('login')}
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ boxShadow: '0 4px 18px hsl(221 83% 53% / 0.35)' }}
            >
              <LogIn className="w-4 h-4" /> Log In
            </button>
            <button
              onClick={() => setActivePage('signup')}
              className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl border-2 border-mc-200 text-mc-700 font-semibold text-sm transition-all duration-200 hover:bg-mc-50 hover:border-mc-400 active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" /> Create Account
            </button>
          </div>
        </div>

        {/* Role Tiles */}
        <div className="grid grid-cols-2 gap-3 mt-6 mc-reveal mc-reveal-delay-2">
          {[
            { icon: Users, title: 'Mentors', desc: 'Guide and teach' },
            { icon: Scale, title: 'Judges', desc: 'Evaluate debates' },
            { icon: BookOpen, title: 'Coaches', desc: 'Build teams' },
            { icon: GraduationCap, title: 'Teachers', desc: 'Educate students' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="mc-card-subtle rounded-xl p-4 text-center">
              <Icon className="w-7 h-7 mx-auto mb-2 text-primary stroke-[1.75]" />
              <h3 className="font-semibold text-sm text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Reviews Section */}
        <div className="mt-8 mc-reveal mc-reveal-delay-3">
          <ReviewsSection />
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-muted-foreground mt-6 mc-reveal mc-reveal-delay-3">
          Demo: Use any listed email with password <span className="font-mono bg-mc-50 px-1.5 py-0.5 rounded text-mc-700">demo123</span>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
