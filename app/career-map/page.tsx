'use client';

import { MapPin, TrendingUp, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CareerMapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Career Map</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visualize your career path and plan your professional journey
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            We're building an interactive career map tool to help you visualize and plan your professional journey from entry-level to senior positions.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Career Paths</h3>
              <p className="text-sm text-gray-600">
                Explore different career trajectories in your field
              </p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Skill Roadmaps</h3>
              <p className="text-sm text-gray-600">
                Get personalized learning paths for your goals
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
