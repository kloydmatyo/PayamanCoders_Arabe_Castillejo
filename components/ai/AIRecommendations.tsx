'use client';

import { useState, useEffect } from 'react';
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
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="text-gray-600">Analyzing jobs for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
        </div>
        <p className="text-gray-600">No recommendations available yet. Complete your profile to get personalized job matches!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Jobs matched to your profile using AI
      </p>

      <div className="space-y-3">
        {recommendations.slice(0, 5).map((job, index) => (
          <Link
            key={job._id}
            href={`/jobs/${job._id}`}
            className="block p-4 border rounded-lg hover:border-purple-300 hover:shadow-md transition-all bg-gradient-to-r from-white to-purple-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                    #{index + 1} Match
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{job.type}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.location}
                  </span>
                  {job.remote && (
                    <span className="text-green-600 font-medium">Remote</span>
                  )}
                </div>
              </div>
              <Briefcase className="w-5 h-5 text-purple-400" />
            </div>
          </Link>
        ))}
      </div>

      {recommendations.length > 5 && (
        <Link
          href="/jobs"
          className="block text-center text-sm text-purple-600 hover:text-purple-700 mt-4 font-medium"
        >
          View all {recommendations.length} recommendations →
        </Link>
      )}
    </div>
  );
}
