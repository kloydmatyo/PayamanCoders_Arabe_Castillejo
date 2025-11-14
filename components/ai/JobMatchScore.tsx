'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface JobMatchScoreProps {
  jobId: string;
}

export default function JobMatchScore({ jobId }: JobMatchScoreProps) {
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeMatch = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/ai/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMatch(data.match);
      } else {
        setError(data.error || 'Failed to analyze match');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      {!match ? (
        <button
          onClick={analyzeMatch}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? 'Analyzing with AI...' : 'AI Match Analysis'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Match Score
            </h3>
            <div className={`text-3xl font-bold ${getScoreColor(match.score)}`}>
              {match.score}%
            </div>
          </div>

          <div className={`w-full h-2 rounded-full ${getScoreBgColor(match.score)}`}>
            <div
              className={`h-full rounded-full ${match.score >= 80 ? 'bg-green-600' : match.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
              style={{ width: `${match.score}%` }}
            />
          </div>

          <p className="text-sm text-gray-700">{match.reasoning}</p>

          {match.strengths.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Your Strengths
              </h4>
              <ul className="space-y-1">
                {match.strengths.map((strength: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {match.gaps.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Areas to Improve
              </h4>
              <ul className="space-y-1">
                {match.gaps.map((gap: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={analyzeMatch}
            disabled={loading}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <TrendingUp className="w-4 h-4" />
            Re-analyze
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  );
}
