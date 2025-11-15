'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateWebinarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    duration: 60,
    meetLink: '',
    maxAttendees: 100,
    category: 'other',
    tags: '',
  });

  // Redirect if not mentor or admin
  if (user && !['mentor', 'admin'].includes(user.role)) {
    router.push('/webinars');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/webinars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/webinars/${data.webinar._id}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create webinar');
      }
    } catch (error) {
      console.error('Error creating webinar:', error);
      alert('Failed to create webinar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/webinars"
          className="mb-6 inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to webinars
        </Link>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            Create New Webinar
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Webinar Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="e.g., Mastering Technical Interviews"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Describe what attendees will learn..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4" />
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4" />
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="15"
                  max="240"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>

            {/* Google Meet Link */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <LinkIcon className="h-4 w-4" />
                Google Meet Link
              </label>
              <input
                type="url"
                name="meetLink"
                value={formData.meetLink}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
              />
              <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="mb-2 text-xs font-medium text-blue-900">
                  📝 How to create a Google Meet link:
                </p>
                <ol className="ml-4 list-decimal space-y-1 text-xs text-blue-700">
                  <li>Go to <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="underline">meet.google.com</a></li>
                  <li>Click "New meeting" → "Create a meeting for later"</li>
                  <li>Copy the meeting link and paste it above</li>
                </ol>
                <p className="mt-2 text-xs text-blue-600">
                  💡 Registered attendees will see this link and can add the webinar to their Google Calendar automatically!
                </p>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="career_development">Career Development</option>
                <option value="technical_skills">Technical Skills</option>
                <option value="interview_prep">Interview Preparation</option>
                <option value="industry_insights">Industry Insights</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Max Attendees */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Users className="h-4 w-4" />
                Max Attendees
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                min="1"
                max="500"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Topics/Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="e.g., JavaScript, React, Career Tips (comma-separated)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 px-6 py-3 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Webinar'}
              </button>
              <Link
                href="/webinars"
                className="btn-secondary px-6 py-3"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
