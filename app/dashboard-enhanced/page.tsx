'use client'

/**
 * Enhanced Dashboard Page
 * Demonstrates atomic design components in a real dashboard
 */

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Badge, Button, Spinner } from '@/components/atoms'
import { ApplicationCard, EmptyState } from '@/components/molecules'
import { useDashboardApplications } from '@/hooks/useApplications'
import { useProfile } from '@/hooks/useAuth'
import { useJobs } from '@/hooks/useJobs'

export default function EnhancedDashboardPage() {
  const router = useRouter()
  const { user, loading: userLoading } = useProfile()
  const { applications, loading: appsLoading } = useDashboardApplications()
  const { jobs: recommendedJobs, loading: jobsLoading } = useJobs({ limit: 3 })

  // Calculate stats
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your job search
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.reviewed}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.accepted}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <Card variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/my-applications')}
                >
                  View All
                </Button>
              </div>

              {appsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : applications.length === 0 ? (
                <EmptyState
                  title="No Applications Yet"
                  description="Start applying to jobs to see them here"
                  actionLabel="Browse Jobs"
                  onAction={() => router.push('/jobs-browse')}
                  icon={
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <ApplicationCard
                      key={application._id || application.id}
                      application={application}
                      viewMode="applicant"
                      onView={() => router.push(`/applications/${application._id || application.id}`)}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Recommendations */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  fullWidth
                  onClick={() => router.push('/jobs-browse')}
                >
                  Browse Jobs
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => router.push('/resume-builder')}
                >
                  Build Resume
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => router.push('/assessments')}
                >
                  Take Assessment
                </Button>
                <Button 
                  variant="outline" 
                  fullWidth
                  onClick={() => router.push('/profile')}
                >
                  Update Profile
                </Button>
              </div>
            </Card>

            {/* Recommended Jobs */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
              
              {jobsLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : recommendedJobs.length === 0 ? (
                <p className="text-sm text-gray-600">No recommendations available</p>
              ) : (
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div 
                      key={job._id || job.id}
                      className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="primary" size="sm">{job.type}</Badge>
                        {job.remote && <Badge variant="success" size="sm">Remote</Badge>}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/jobs/${job._id || job.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Profile Completion */}
            <Card variant="elevated" padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Strength</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium text-gray-900">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Complete your profile to increase visibility:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Basic information
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      Work experience
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-400 mr-2">○</span>
                      Skills assessment
                    </li>
                    <li className="flex items-center">
                      <span className="text-gray-400 mr-2">○</span>
                      Resume upload
                    </li>
                  </ul>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  onClick={() => router.push('/profile')}
                >
                  Complete Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
