'use client'

/**
 * Employer Applications Page
 * View applications for employer's jobs using atomic design components
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import { ApplicationList } from '@/components/organisms'
import { Application } from '@/interfaces'

export default function EmployerApplicationsPage() {
  const router = useRouter()

  const handleApplicationClick = (application: Application) => {
    router.push(`/employer/applications/${application._id || application.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-2 text-gray-600">
            Review and manage applications for your job postings
          </p>
        </div>

        <ApplicationList
          viewMode="employer"
          onApplicationClick={handleApplicationClick}
        />
      </div>
    </div>
  )
}
