'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Bookmark, ExternalLink, Clock, DollarSign, Star, Trash2 } from 'lucide-react';

interface BookmarkedResource {
  title: string;
  description: string;
  url: string;
  type: string;
  platform: string;
  difficulty: string;
  estimatedTime: string;
  isFree: boolean;
  rating?: string;
}

export default function BookmarksPage() {
  const [isEntering, setIsEntering] = useState(true);
  const [bookmarkedUrls, setBookmarkedUrls] = useState<Set<string>>(new Set());
  const [allResources, setAllResources] = useState<BookmarkedResource[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    try {
      // Load bookmarked URLs
      const savedUrls = localStorage.getItem('bookmarkedResources');
      if (savedUrls) {
        setBookmarkedUrls(new Set<string>(JSON.parse(savedUrls)));
      }

      // Load full resource details
      const savedResources = localStorage.getItem('bookmarkedResourcesDetails');
      if (savedResources) {
        setAllResources(JSON.parse(savedResources));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const removeBookmark = (url: string) => {
    // Remove from URLs set
    const newUrls = new Set(bookmarkedUrls);
    newUrls.delete(url);
    setBookmarkedUrls(newUrls);
    localStorage.setItem('bookmarkedResources', JSON.stringify(Array.from(newUrls)));

    // Remove from resources array
    const newResources = allResources.filter(r => r.url !== url);
    setAllResources(newResources);
    localStorage.setItem('bookmarkedResourcesDetails', JSON.stringify(newResources));
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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <Bookmark className="h-7 w-7 fill-current" />
            </div>
            <h1 className="auth-title text-3xl font-bold animate-[floatUp_0.85s_ease-out]">
              My Bookmarks
            </h1>
          </div>
          <p className="auth-subtitle">
            Your saved learning resources
          </p>
        </div>

        {/* Bookmarks List */}
        {allResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allResources.map((resource, index) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="feature-card p-5 hover:shadow-xl transition-all block relative group"
                style={{ '--float-delay': `${0.05 + index * 0.03}s` } as CSSProperties}
              >
                {/* Remove Button */}
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm('Remove this bookmark?')) {
                      removeBookmark(resource.url);
                    }
                  }}
                  className="absolute top-3 right-3 z-20 p-2 rounded-lg transition-all bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </div>
                  <div className="flex items-start gap-3 mb-3">
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
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Bookmark className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                <p className="text-secondary-600 mb-4">
                  Start bookmarking learning resources from your career map to see them here
                </p>
                <a href="/career-map" className="btn-primary inline-flex items-center gap-2">
                  Go to Career Map
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
