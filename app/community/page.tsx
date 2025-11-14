'use client';

import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-12 h-12 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Community</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with peers, mentors, and professionals in your field
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Coming Soon!
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            We're building a vibrant community platform where you can connect with peers, share experiences, and get advice from professionals.
          </p>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-green-50 rounded-lg">
              <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Discussion Forums</h3>
              <p className="text-sm text-gray-600">
                Share tips, ask questions, and learn from others
              </p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <Heart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Mentorship</h3>
              <p className="text-sm text-gray-600">
                Connect with mentors and get career guidance
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
