'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CreateResourcePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'article',
    category: 'Career Development',
    tags: '',
    url: '',
  });

  // Redirect if not mentor or admin
  if (user && !['mentor', 'admin'].includes(user.role)) {
    router.push('/resources');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        router.push('/resources');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create resource');
      }
    } catch (error) {
      console.error('Error creating resource:', error);
      alert('Failed to create resource');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/resources"
          className="mb-6 inline-flex items-center gap-2 text-sm text-secondary-600 hover:text-primary-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to resources
        </Link>

        {/* Form Card */}
        <div className="rounded-2xl border border-white/40 bg-white/60 p-8 shadow-xl backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Resource
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Resource Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="e.g., Complete Guide to Technical Interviews"
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
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Describe what this resource covers..."
              />
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="article">Article</option>
                  <option value="video">Video</option>
                  <option value="guide">Guide</option>
                  <option value="template">Template</option>
                  <option value="tool">Tool</option>
                  <option value="course">Course</option>
                </select>
              </div>

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
                  <option value="Career Development">Career Development</option>
                  <option value="Resume Writing">Resume Writing</option>
                  <option value="Interview Prep">Interview Prep</option>
                  <option value="Technical Skills">Technical Skills</option>
                  <option value="Networking">Networking</option>
                  <option value="Job Search">Job Search</option>
                </select>
              </div>
            </div>

            {/* URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Resource URL *
              </label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="https://example.com/resource"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="e.g., interview, coding, preparation"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 px-6 py-3 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Resource'}
              </button>
              <Link
                href="/resources"
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
