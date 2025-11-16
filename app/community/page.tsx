'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Users, MessageSquare, Heart, TrendingUp, Send, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Post {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  title: string;
  content: string;
  category: string;
  likes: number;
  comments: number;
  timestamp: string;
  trending?: boolean;
  isLiked?: boolean;
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [isEntering, setIsEntering] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [postComments, setPostComments] = useState<{ [key: string]: any[] }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchTopContributors();
  }, [activeTab, selectedCategory, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (activeTab === 'trending') {
        params.append('trending', 'true');
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/community/posts?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopContributors = async () => {
    try {
      const response = await fetch('/api/community/stats');
      
      if (response.ok) {
        const data = await response.json();
        setTopContributors(data.topContributors || []);
      }
    } catch (error) {
      console.error('Error fetching top contributors:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts([data.post, ...posts]);
        setNewPost({ title: '', content: '', category: 'General' });
        setShowCreateModal(false);
        fetchTopContributors(); // Refresh top contributors
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes: data.likes, isLiked: data.liked }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const fetchComments = async (postId: string, forceRefresh = false) => {
    if (postComments[postId] && !forceRefresh) {
      // Already loaded and not forcing refresh
      return;
    }

    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      const response = await fetch(`/api/community/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setPostComments(prev => ({ ...prev, [postId]: data.comments }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = (postId: string) => {
    if (commentingPostId === postId) {
      setCommentingPostId(null);
    } else {
      setCommentingPostId(postId);
      fetchComments(postId);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, comments: data.comments }
            : post
        ));
        setCommentText('');
        
        // Force refresh comments to show the new one
        await fetchComments(postId, true);
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const categories = ['all', 'Career Advice', 'Career Growth', 'Learning', 'Work Life', 'Networking', 'General'];

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <Users className="h-7 w-7" />
            </div>
            <h1 className="auth-title text-3xl font-bold animate-[floatUp_0.85s_ease-out]">
              Community
            </h1>
          </div>
          <p className="auth-subtitle">
            Connect, share, and learn from professionals in your field
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post Card */}
            <div className="card">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-semibold flex-shrink-0">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <input
                    type="text"
                    placeholder="Share your thoughts with the community..."
                    onClick={() => setShowCreateModal(true)}
                    readOnly
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 hover:border-primary-500 cursor-pointer transition-all"
                  />
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Post</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Create a Post</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          placeholder="Enter post title..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        >
                          {categories.filter(c => c !== 'all').map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          placeholder="Share your thoughts, experiences, or questions..."
                          rows={6}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                        />
                      </div>
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => setShowCreateModal(false)}
                          className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                          disabled={submitting}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePost}
                          disabled={submitting}
                          className="btn-primary flex items-center gap-2"
                        >
                          {submitting ? 'Posting...' : 'Publish Post'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="card">
              <div className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Tabs */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'all'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => setActiveTab('trending')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        activeTab === 'trending'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Trending
                    </button>
                  </div>

                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="futuristic-loader mx-auto mb-4" style={{ width: '40px', height: '40px' }}>
                    <div className="futuristic-loader-inner"></div>
                  </div>
                  <p className="auth-subtitle">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="card text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-secondary-600 mb-6">Be the first to share something with the community!</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Post
                  </button>
                </div>
              ) : (
                posts.map((post, index) => (
                <div
                  key={post.id}
                  className="card group hover:shadow-xl transition-all duration-300"
                  style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
                >
                  <div className="p-6">
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xs font-semibold">
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{post.author.name}</p>
                        <p className="text-sm text-secondary-600">{post.author.role} • {post.timestamp}</p>
                      </div>
                      {post.trending && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                    </div>

                    {/* Post Content */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-secondary-700 mb-4">{post.content}</p>

                    {/* Category */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-600 mb-4">
                      {post.category}
                    </span>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6 mb-4">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            post.isLiked 
                              ? 'text-red-500' 
                              : 'text-secondary-600 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        <button 
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                      </div>

                      {/* Comments Section */}
                      {commentingPostId === post.id && (
                        <div className="space-y-4">
                          {/* Existing Comments */}
                          {loadingComments[post.id] ? (
                            <div className="text-center py-4">
                              <div className="futuristic-loader mx-auto" style={{ width: '30px', height: '30px' }}>
                                <div className="futuristic-loader-inner"></div>
                              </div>
                            </div>
                          ) : postComments[post.id] && postComments[post.id].length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {postComments[post.id].map((comment: any) => (
                                <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-semibold flex-shrink-0">
                                    {comment.author.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="text-sm font-semibold text-gray-900">{comment.author.name}</p>
                                      <span className="text-xs text-secondary-500">•</span>
                                      <p className="text-xs text-secondary-500">{comment.author.role}</p>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                    <p className="text-xs text-secondary-500 mt-1">
                                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-secondary-500 text-center py-4">No comments yet. Be the first to comment!</p>
                          )}

                          {/* Comment Input */}
                          <div className="flex gap-3 pt-3 border-t border-gray-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xs font-semibold flex-shrink-0">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleComment(post.id);
                                  }
                                }}
                              />
                              <button
                                onClick={() => handleComment(post.id)}
                                className="btn-primary px-4 py-2 text-sm"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <div className="card">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary-500" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-primary-500 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Contributors */}
            <div className="card">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Top Contributors</h3>
                <div className="space-y-4">
                  {topContributors.length > 0 ? (
                    topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xs font-semibold">
                          {contributor.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{contributor.name}</p>
                          <p className="text-xs text-secondary-600">{contributor.posts} posts • {contributor.role}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-secondary-600 text-center py-4">
                      No contributors yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
