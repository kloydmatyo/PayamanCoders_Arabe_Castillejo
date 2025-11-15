'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="community-gradient relative min-h-screen overflow-hidden py-24">
      <div className="community-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`community-panel text-center mb-12 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-4 animate-[floatUp_0.85s_ease-out]">
            <Users className="w-12 h-12 text-green-500" />
            <h1 className="auth-title text-4xl font-bold md:text-5xl" style={{ backgroundImage: 'linear-gradient(120deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 0.85), rgba(34, 197, 94, 1))', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Community</h1>
          </div>
          <p className="auth-subtitle text-xl max-w-3xl mx-auto">
            Connect with peers, mentors, and professionals in your field
          </p>
        </div>

        {/* Coming Soon Card */}
        <div 
          className={`card max-w-3xl mx-auto text-center ${isEntering ? 'auth-panel-enter' : ''}`}
          style={{ '--float-delay': '0.1s' } as CSSProperties}
        >
          <div className="feature-icon mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <MessageSquare className="w-10 h-10 text-green-500" />
          </div>
          
          <h2 className="auth-title text-3xl font-bold mb-4" style={{ backgroundImage: 'linear-gradient(120deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 0.85), rgba(34, 197, 94, 1))', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Coming Soon!
          </h2>
          
          <p className="auth-subtitle text-lg mb-8">
            We're building a vibrant community platform where you can connect with peers, share experiences, and get advice from professionals.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className="community-feature-card p-6 text-center"
              style={{ '--float-delay': '0.2s' } as CSSProperties}
            >
              <div className="community-feature-icon mx-auto mb-3">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Discussion Forums</h3>
              <p className="text-sm text-secondary-600">
                Share tips, ask questions, and learn from others
              </p>
            </div>
            
            <div 
              className="community-feature-card p-6 text-center"
              style={{ '--float-delay': '0.3s' } as CSSProperties}
            >
              <div className="community-feature-icon mx-auto mb-3">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mentorship</h3>
              <p className="text-sm text-secondary-600">
                Connect with mentors and get career guidance
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="community-button"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
