'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Video, FileText, Wrench, Award, Plus, Filter, TrendingUp, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  url?: string;
  author: {
    name: string;
  };
  upvotes: number;
  views: number;
  createdAt: string;
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchResources();
  }, [filter, category]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`/api/resources?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'template': return FileText;
      case 'tool': return Wrench;
      case 'guide': return BookOpen;
      case 'course': return Award;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      video: 'bg-red-100 text-red-700',
      article: 'bg-blue-100 text-blue-700',
      template: 'bg-green-100 text-green-700',
      tool: 'bg-purple-100 text-purple-700',
      guide: 'bg-orange-100 text-orange-700',
      course: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📚 Resource Library
              </h1>
              <p className="mt-2 text-secondary-600">
                Curated career resources from mentors and experts
              </p>
            </div>
            {user && ['mentor', 'admin'].includes(user.role) && (
              <Link
                href="/resources/create"
                className="btn-primary px-4 py-2 text-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-secondary-600" />
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="video">Videos</option>
              <option value="guide">Guides</option>
              <option value="template">Templates</option>
              <option value="tool">Tools</option>
              <option value="course">Courses</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Categories</option>
              <option value="Resume Writing">Resume Writing</option>
              <option value="Interview Prep">Interview Prep</option>
              <option value="Career Development">Career Development</option>
              <option value="Technical Skills">Technical Skills</option>
              <option value="Networking">Networking</option>
              <option value="Job Search">Job Search</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/40 bg-white/60 p-6"
              >
                <div className="mb-4 h-6 w-3/4 rounded bg-white/70"></div>
                <div className="mb-2 h-4 w-full rounded bg-white/70"></div>
                <div className="mb-4 h-4 w-2/3 rounded bg-white/70"></div>
                <div className="h-10 w-full rounded bg-white/70"></div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary-500/40 bg-white/40 py-16 text-center backdrop-blur">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-secondary-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No resources found
            </h3>
            <p className="text-secondary-600">
              Check back later for new resources
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = getTypeIcon(resource.type);
              return (
                <div
                  key={resource._id}
                  className="group rounded-2xl border border-white/40 bg-white/60 p-6 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/10"
                >
                  {/* Type Badge */}
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getTypeColor(
                        resource.type
                      )}`}
                    >
                      <Icon className="h-3 w-3" />
                      {resource.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-sm text-secondary-600">
                    {resource.description}
                  </p>

                  {/* Author */}
                  <p className="mb-3 text-xs text-secondary-500">
                    By {resource.author.name}
                  </p>

                  {/* Stats */}
                  <div className="mb-4 flex items-center gap-4 text-xs text-secondary-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {resource.upvotes} upvotes
                    </span>
                    <span>{resource.views} views</span>
                  </div>

                  {/* Action Button */}
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex w-full items-center justify-center gap-2 px-4 py-2 text-sm"
                    >
                      View Resource
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
