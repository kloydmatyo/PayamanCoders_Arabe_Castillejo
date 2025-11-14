'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface ATSScoreCardProps {
  resumeData: any;
  jobDescription: string;
  onScoreUpdate: (score: any) => void;
}

export default function ATSScoreCard({ resumeData, jobDescription, onScoreUpdate }: ATSScoreCardProps) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    if (resumeData && jobDescription) {
      analyzeATS();
    }
  }, [resumeData, jobDescription]);

  const analyzeATS = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resume-builder/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        setScore(data.atsScore);
        onScoreUpdate(data.atsScore);
      }
    } catch (error) {
      console.error('ATS score error:', error);
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

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
          <h3 className="font-semibold text-gray-900">ATS Score</h3>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing resume...</p>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">ATS Score</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Complete your resume to see your ATS compatibility score
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">ATS Compatibility Score</h3>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${getScoreColor(score.score)} mb-2`}>
          {score.score}%
        </div>
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getScoreBgColor(score.score)} ${getScoreColor(score.score)}`}>
          {getScoreLabel(score.score)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full h-3 rounded-full ${getScoreBgColor(score.score)} mb-6`}>
        <div
          className={`h-full rounded-full transition-all ${
            score.score >= 80 ? 'bg-green-600' : score.score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
          }`}
          style={{ width: `${score.score}%` }}
        />
      </div>

      {/* Keyword Match */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Keyword Matches</span>
          <span className="text-sm font-bold text-gray-900">
            {score.keywordMatches} / {score.totalKeywords}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-purple-600 rounded-full transition-all"
            style={{ width: `${(score.keywordMatches / score.totalKeywords) * 100}%` }}
          />
        </div>
      </div>

      {/* Suggestions */}
      {score.suggestions && score.suggestions.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Improvement Suggestions
          </h4>
          <ul className="space-y-2">
            {score.suggestions.map((suggestion: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={analyzeATS}
        disabled={loading}
        className="w-full mt-4 py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Re-analyze'}
      </button>
    </div>
  );
}
