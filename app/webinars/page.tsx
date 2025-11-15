'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Video, Plus, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Webinar {
  _id: string;
  title: string;
  description: string;
  host: {
    name: string;
    role: string;
    avatar?: string;
  };
  scheduledDate: string;
  duration: number;
  meetLink?: string;
  maxAttendees?: number;
  category: string;
  tags: string[];
  status: string;
  attendees: any[];
}

export default function WebinarsPage() {
  const { user } = useAuth();
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('scheduled');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchWebinars();
  }, [filter, category]);

  const fetchWebinars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`/api/webinars?${params}`);
      if (response.ok) {
        const data = await response.json();
        setWebinars(data.webinars || []);
      }
    } catch (error) {
      console.error('Error fetching webinars:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      career_development: 'bg-blue-100 text-blue-700',
      technical_skills: 'bg-purple-100 text-purple-700',
      interview_prep: 'bg-green-100 text-green-700',
      industry_insights: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[cat] || colors.other;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      career_development: 'Career Development',
      technical_skills: 'Technical Skills',
      interview_prep: 'Interview Prep',
      industry_insights: 'Industry Insights',
      other: 'Other',
    };
    return labels[cat] || cat;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <div className="border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Career Webinars
              </h1>
              <p className="mt-2 text-secondary-600">
                Learn from industry experts and mentors
              </p>
            </div>
            {user && ['mentor', 'admin'].includes(user.role) && (
              <Link
                href="/webinars/create"
                className="btn-primary px-4 py-2 text-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Webinar
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
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All</option>
              <option value="scheduled">Upcoming</option>
              <option value="live">Live Now</option>
              <option value="completed">Past</option>
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
              <option value="career_development">Career Development</option>
              <option value="technical_skills">Technical Skills</option>
              <option value="interview_prep">Interview Prep</option>
              <option value="industry_insights">Industry Insights</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Webinars List */}
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
        ) : webinars.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary-500/40 bg-white/40 py-16 text-center backdrop-blur">
            <Video className="mx-auto mb-4 h-12 w-12 text-secondary-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No webinars found
            </h3>
            <p className="text-secondary-600">
              Check back later for upcoming webinars
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {webinars.map((webinar) => (
              <Link
                key={webinar._id}
                href={`/webinars/${webinar._id}`}
                className="group rounded-2xl border border-white/40 bg-white/60 p-6 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-xl hover:shadow-primary-900/10"
              >
                {/* Status Badge */}
                {webinar.status === 'live' && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
                    LIVE NOW
                  </div>
                )}

                {/* Category */}
                <span
                  className={`mb-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryColor(
                    webinar.category
                  )}`}
                >
                  {getCategoryLabel(webinar.category)}
                </span>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                  {webinar.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-secondary-600">
                  {webinar.description}
                </p>

                {/* Host */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600">
                    {webinar.host.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {webinar.host.name}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {webinar.host.role}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(webinar.scheduledDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Clock className="h-4 w-4" />
                    {webinar.duration} minutes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <Users className="h-4 w-4" />
                    {webinar.attendees.length}
                    {webinar.maxAttendees && ` / ${webinar.maxAttendees}`}{' '}
                    registered
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
