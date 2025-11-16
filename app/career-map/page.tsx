'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { MapPin, TrendingUp, Target, BookOpen, CheckCircle, Star, Award } from 'lucide-react';

export default function CareerMapPage() {
  const [isEntering, setIsEntering] = useState(true);
  const [showAIGuidance, setShowAIGuidance] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [interests, setInterests] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<any>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  const getAICareerSuggestions = async () => {
    console.log('🚀 Starting AI career suggestions...');
    try {
      setLoadingAI(true);
      console.log('📤 Sending request with interests:', interests);
      
      const response = await fetch('/api/ai/career-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Received suggestions:', data);
        setAiSuggestions(data.suggestions || []);
        
        if (!data.suggestions || data.suggestions.length === 0) {
          alert('No career suggestions were generated. Please try again.');
        }
      } else {
        const error = await response.json();
        console.error('❌ API Error:', error);
        alert(error.error || 'Failed to get AI suggestions');
      }
    } catch (error) {
      console.error('❌ Error getting AI suggestions:', error);
      alert(`Failed to get AI career suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingAI(false);
      console.log('✅ AI suggestions request completed');
    }
  };

  const handleSelectCareer = (career: any) => {
    setSelectedCareer(career);
    setShowAIGuidance(false);
  };

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
                <MapPin className="h-7 w-7" />
              </div>
              <h1 className="auth-title text-3xl font-bold animate-[floatUp_0.85s_ease-out]">
                Career Map
              </h1>
            </div>
            {selectedCareer && (
              <button
                onClick={() => {
                  setShowAIGuidance(true);
                  setSelectedCareer(null);
                }}
                className="btn-secondary flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Change Career Path
              </button>
            )}
          </div>
          <p className="auth-subtitle">
            {selectedCareer 
              ? `Your personalized roadmap for ${selectedCareer.title}`
              : 'Get AI-powered career recommendations based on your skills'}
          </p>
        </div>

        {/* AI Career Guidance Section */}
        {showAIGuidance && !selectedCareer && (
          <div className="card mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">AI-Powered Career Guidance</h2>
                  <p className="text-secondary-600">Get personalized career recommendations based on your skills</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your interests? (Optional)
                  </label>
                  <textarea
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g., I enjoy problem-solving, working with data, creating visual designs..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  onClick={getAICareerSuggestions}
                  disabled={loadingAI}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loadingAI ? (
                    <>
                      <div className="futuristic-loader" style={{ width: '20px', height: '20px' }}>
                        <div className="futuristic-loader-inner"></div>
                      </div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5" />
                      Get AI Career Suggestions
                    </>
                  )}
                </button>
              </div>

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recommended Career Paths for You - Select One to Continue
                  </h3>
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="feature-card p-6 cursor-pointer hover:shadow-xl transition-all"
                      style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                      onClick={() => handleSelectCareer(suggestion)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            {suggestion.title}
                          </h4>
                          <p className="text-secondary-700 mb-3">{suggestion.description}</p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                            <div className="text-center">
                              <div className="text-xl font-bold">{suggestion.matchScore}</div>
                              <div className="text-xs">Match</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Why this matches you:</h5>
                          <ul className="space-y-1">
                            {suggestion.reasons?.slice(0, 3).map((reason: string, idx: number) => (
                              <li key={idx} className="text-sm text-secondary-700 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Details:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-primary-500" />
                              <span className="text-secondary-700">Salary: {suggestion.salaryRange}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4 text-primary-500" />
                              <span className="text-secondary-700">Growth: {suggestion.growthPotential}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Skills to develop:</h5>
                        <div className="flex flex-wrap gap-2">
                          {suggestion.requiredSkills?.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <button className="btn-primary w-full">
                          Select This Career Path
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selected Career Details */}
        {selectedCareer && (
          <div className="card mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                  <Target className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCareer.title}</h2>
                  <p className="text-secondary-600">Your Personalized Career Roadmap</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Career Overview</h3>
                <p className="text-secondary-700 mb-4">{selectedCareer.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
                        <div className="text-lg font-bold">{selectedCareer.matchScore}</div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Match Score</span>
                    </div>
                    <p className="text-xs text-secondary-600">Based on your skills and interests</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Salary Range</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedCareer.salaryRange}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Growth Potential</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">{selectedCareer.growthPotential}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why This Career Matches You</h3>
                <ul className="space-y-2">
                  {selectedCareer.reasons?.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-secondary-700">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills You Need to Develop</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.requiredSkills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-primary-100 text-primary-700 border border-primary-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Learning Resources</h3>
              </div>
              <p className="text-secondary-600 mb-4">
                Explore courses and resources to advance your career
              </p>
              <button className="btn-primary w-full">Browse Resources</button>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Find a Mentor</h3>
              </div>
              <p className="text-secondary-600 mb-4">
                Connect with experienced professionals in your field
              </p>
              <button className="btn-secondary w-full">Find Mentors</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
