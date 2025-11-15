'use client'

/**
 * Jobs Browse Page
 * Browse and search for jobs using atomic design components
 */

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JobList } from '@/components/organisms'
import { Job } from '@/interfaces'

export default function JobsBrowsePage() {
  const router = useRouter()

  const handleJobClick = (job: Job) => {
    router.push(`/jobs/${job._id || job.id}`)
  }

  const handleJobApply = (job: Job) => {
    router.push(`/jobs/${job._id || job.id}?apply=true`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="mt-2 text-gray-600">
            Find your next opportunity from thousands of available positions
          </p>
        </div>

        <JobList
          onJobClick={handleJobClick}
          onJobApply={handleJobApply}
          showSearch={true}
          showFilters={true}
        />
      </div>
    </div>
  )
}
