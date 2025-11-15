'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { MapPin, TrendingUp, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CareerMapPage() {
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="career-map-gradient relative min-h-screen overflow-hidden py-24">
      <div className="career-map-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`career-map-panel text-center mb-12 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-4 animate-[floatUp_0.85s_ease-out]">
            <MapPin className="w-12 h-12 text-yellow-500" />
            <h1 className="auth-title text-4xl font-bold md:text-5xl" style={{ backgroundImage: 'linear-gradient(120deg, rgba(234, 179, 8, 1), rgba(245, 158, 11, 0.85), rgba(234, 179, 8, 1))', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Career Map</h1>
          </div>
          <p className="auth-subtitle text-xl max-w-3xl mx-auto">
            Visualize your career path and plan your professional journey
          </p>
        </div>

        {/* Coming Soon Card */}
        <div 
          className={`card max-w-3xl mx-auto text-center ${isEntering ? 'auth-panel-enter' : ''}`}
          style={{ '--float-delay': '0.1s' } as CSSProperties}
        >
          <div className="career-map-feature-icon mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-500/20 to-amber-500/20">
            <TrendingUp className="w-10 h-10" />
          </div>
          
          <h2 className="auth-title text-3xl font-bold mb-4" style={{ backgroundImage: 'linear-gradient(120deg, rgba(234, 179, 8, 1), rgba(245, 158, 11, 0.85), rgba(234, 179, 8, 1))', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Coming Soon!
          </h2>
          
          <p className="auth-subtitle text-lg mb-8">
            We're building an interactive career map tool to help you visualize and plan your professional journey from entry-level to senior positions.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className="career-map-feature-card p-6 text-center"
              style={{ '--float-delay': '0.2s' } as CSSProperties}
            >
              <div className="career-map-feature-icon mx-auto mb-3">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Career Paths</h3>
              <p className="text-sm text-secondary-600">
                Explore different career trajectories in your field
              </p>
            </div>
            
            <div 
              className="career-map-feature-card p-6 text-center"
              style={{ '--float-delay': '0.3s' } as CSSProperties}
            >
              <div className="career-map-feature-icon mx-auto mb-3">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Skill Roadmaps</h3>
              <p className="text-sm text-secondary-600">
                Get personalized learning paths for your goals
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="career-map-button"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
