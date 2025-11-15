'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Sparkles, Briefcase, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AIRecommendations() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/ai/recommendations', {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || 'Failed to load recommendations');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4 animate-[floatUp_0.85s_ease-out]">
          <div className="feature-icon">
            <Sparkles className="w-6 h-6 text-primary-500 animate-pulse" />
          </div>
          <h2 className="feature-heading text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="auth-subtitle">Analyzing jobs for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="feature-icon">
            <Sparkles className="w-6 h-6 text-primary-500" />
          </div>
          <h2 className="feature-heading text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="feature-icon">
            <Sparkles className="w-6 h-6 text-primary-500" />
          </div>
          <h2 className="feature-heading text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="auth-subtitle">No recommendations available yet. Complete your profile to get personalized job matches!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4 animate-[floatUp_0.85s_ease-out]">
        <div className="feature-icon">
          <Sparkles className="w-6 h-6 text-primary-500" />
        </div>
        <h2 className="feature-heading text-xl font-semibold">AI-Powered Recommendations</h2>
      </div>
      <p className="auth-subtitle mb-6">
        Jobs matched to your profile using AI
      </p>

      <div className="space-y-4">
        {recommendations.slice(0, 5).map((job, index) => (
          <Link
            key={job._id}
            href={`/jobs/${job._id}`}
            className="feature-card block p-5 group"
            style={{ '--float-delay': `${0.1 + index * 0.08}s` } as CSSProperties}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-500/20 border border-primary-500/30 shadow-inner shadow-primary-700/20">
                    #{index + 1} Match
                  </span>
                  <span className="text-xs font-medium text-secondary-500 capitalize px-2 py-1 rounded-md bg-white/40 border border-white/40">{job.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-lg group-hover:text-primary-600 transition-colors">{job.title}</h3>
                <p className="text-sm text-secondary-600 mb-3">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-secondary-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    {job.location}
                  </span>
                  {job.remote && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-green-600 font-medium bg-green-500/20 border border-green-500/30">Remote</span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="feature-icon">
                  <Briefcase className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recommendations.length > 5 && (
        <Link
          href="/jobs"
          className="auth-link block text-center text-sm font-medium mt-6"
        >
          View all {recommendations.length} recommendations →
        </Link>
      )}
    </div>
  );
}
