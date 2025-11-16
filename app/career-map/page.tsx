'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { MapPin, TrendingUp, Target, BookOpen, CheckCircle, Star, Award, ExternalLink, Clock, DollarSign, Bookmark } from 'lucide-react';

export default function CareerMapPage() {
  const [isEntering, setIsEntering] = useState(true);
  const [showAIGuidance, setShowAIGuidance] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [interests, setInterests] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [learningResources, setLearningResources] = useState<any[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [bookmarkedUrls, setBookmarkedUrls] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  // Load saved career path and bookmarks on mount
  useEffect(() => {
    loadSavedCareerPath();
    loadBookmarksFromLocalStorage();
  }, []);

  const loadBookmarksFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('bookmarkedResources');
      if (saved) {
        const urls = new Set<string>(JSON.parse(saved));
        setBookmarkedUrls(urls);
      }
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
    }
  };

  const toggleBookmark = (resource: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔖 Toggling bookmark for:', resource.title);
    const isBookmarked = bookmarkedUrls.has(resource.url);
    console.log('📌 Currently bookmarked:', isBookmarked);
    
    // Load existing resources
    const savedResources = localStorage.getItem('bookmarkedResourcesDetails');
    let resources = savedResources ? JSON.parse(savedResources) : [];
    
    const newSet = new Set(bookmarkedUrls);
    
    if (isBookmarked) {
      // Remove bookmark
      console.log('🗑️ Removing bookmark');
      newSet.delete(resource.url);
      resources = resources.filter((r: any) => r.url !== resource.url);
    } else {
      // Add bookmark
      console.log('➕ Adding bookmark');
      newSet.add(resource.url);
      resources.push(resource);
    }
    
    // Save both URLs and full resource details
    localStorage.setItem('bookmarkedResources', JSON.stringify(Array.from(newSet)));
    localStorage.setItem('bookmarkedResourcesDetails', JSON.stringify(resources));
    console.log('💾 Saved to localStorage. Total bookmarks:', newSet.size);
    
    setBookmarkedUrls(newSet);
  };



  const loadSavedCareerPath = async () => {
    try {
      console.log('🔄 Loading saved career path...');
      const response = await fetch('/api/career-path');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Received data:', data);
        
        if (data.careerPath) {
          console.log('✅ Found saved career:', data.careerPath.title);
          setSelectedCareer(data.careerPath);
          setShowAIGuidance(false);
        } else {
          console.log('ℹ️ No saved career path found');
        }
      } else {
        console.error('❌ Failed to load career path, status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading saved career path:', error);
    }
  };



  const getAICareerSuggestions = async () => {
    try {
      setLoadingAI(true);
      
      const response = await fetch('/api/ai/career-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
        
        if (!data.suggestions || data.suggestions.length === 0) {
          alert('No career suggestions were generated. Please try again.');
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to get AI suggestions');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      alert(`Failed to get AI career suggestions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSelectCareer = (career: any) => {
    // Batch state updates together
    setSelectedCareer(career);
    setShowAIGuidance(false);
    
    // Then save to database in the background (don't await)
    fetch('/api/career-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ careerPath: career }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.careerPath) {
          // Update with the saved data that includes selectedAt timestamp
          setSelectedCareer(data.careerPath);
        }
      })
      .catch(error => {
        console.error('Error saving career path:', error);
      });
  };

  const getLearningResources = async () => {
    if (!selectedCareer) return;
    
    try {
      setLoadingResources(true);
      setShowResources(true);
      
      const response = await fetch('/api/ai/learning-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerTitle: selectedCareer.title,
          skills: selectedCareer.requiredSkills || []
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLearningResources(data.resources || []);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to get learning resources');
      }
    } catch (error) {
      console.error('❌ Error getting learning resources:', error);
      alert('Failed to get learning resources');
    } finally {
      setLoadingResources(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Course': return '🎓';
      case 'Tutorial': return '📚';
      case 'Documentation': return '📖';
      case 'Video': return '🎥';
      case 'Article': return '📝';
      case 'Book': return '📕';
      default: return '📌';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
                onClick={async () => {
                  if (confirm('Are you sure you want to change your career path? Your current selection will be removed.')) {
                    setShowAIGuidance(true);
                    setSelectedCareer(null);
                    setShowResources(false);
                    setLearningResources([]);
                    // Remove saved career path
                    try {
                      await fetch('/api/career-path', { method: 'DELETE' });
                    } catch (error) {
                      console.error('Error removing career path:', error);
                    }
                  }
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
                      className="feature-card p-6 hover:shadow-xl transition-all"
                      style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
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
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelectCareer(suggestion);
                          }}
                          className="btn-primary w-full"
                          type="button"
                        >
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                    <Target className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCareer.title}</h2>
                    <p className="text-secondary-600">Your Personalized Career Roadmap</p>
                  </div>
                </div>
                {selectedCareer.selectedAt && (
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Saved
                    </span>
                    <p className="text-xs text-secondary-600 mt-1">
                      {new Date(selectedCareer.selectedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
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

        {/* Learning Resources Section */}
        {selectedCareer && (
          <div className="card mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI-Curated Learning Resources</h3>
                    <p className="text-sm text-secondary-600">Personalized resources for {selectedCareer.title}</p>
                  </div>
                </div>
                {!showResources && (
                  <button 
                    onClick={getLearningResources}
                    disabled={loadingResources}
                    className="btn-primary flex items-center gap-2"
                  >
                    {loadingResources ? (
                      <>
                        <div className="futuristic-loader" style={{ width: '16px', height: '16px' }}>
                          <div className="futuristic-loader-inner"></div>
                        </div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Star className="w-4 h-4" />
                        Get Resources
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {showResources && (
              <div className="p-6">
                {loadingResources ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="futuristic-loader mb-4" style={{ width: '48px', height: '48px' }}>
                      <div className="futuristic-loader-inner"></div>
                    </div>
                    <p className="text-secondary-600">AI is searching the internet for the best learning resources...</p>
                  </div>
                ) : learningResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningResources.map((resource, index) => {
                      const isBookmarked = bookmarkedUrls.has(resource.url);
                      return (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="feature-card p-5 hover:shadow-xl transition-all block group relative"
                          style={{ '--float-delay': `${0.05 + index * 0.03}s` } as CSSProperties}
                        >
                          {/* Bookmark Button */}
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleBookmark(resource, e);
                            }}
                            className={`absolute top-3 right-3 z-20 p-2 rounded-lg transition-all cursor-pointer ${
                              isBookmarked
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </div>
                            <div className="flex items-start gap-3 mb-3 pr-12">
                              <span className="text-3xl">{getResourceIcon(resource.type)}</span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-2">
                                  {resource.title}
                                </h4>
                                <p className="text-sm text-secondary-600 mb-2 line-clamp-2">
                                  {resource.description}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700 border border-primary-200">
                                {resource.platform}
                              </span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getDifficultyColor(resource.difficulty)}`}>
                                {resource.difficulty}
                              </span>
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                {resource.type}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-secondary-600">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {resource.estimatedTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  {resource.isFree ? (
                                    <span className="text-green-600 font-semibold">Free</span>
                                  ) : (
                                    <>
                                      <DollarSign className="w-3 h-3" />
                                      Paid
                                    </>
                                  )}
                                </span>
                              </div>
                              {resource.rating && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {resource.rating}
                                </span>
                              )}
                            </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-secondary-600">No resources found. Please try again.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Other Resources */}
        {!selectedCareer && (
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
                  Select a career path to get AI-curated learning resources
                </p>
                <button className="btn-secondary w-full" disabled>
                  Select Career First
                </button>
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
        )}
      </div>
    </div>
  );
}
