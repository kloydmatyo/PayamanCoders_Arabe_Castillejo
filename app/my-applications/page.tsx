'use client'

/**
 * My Applications Page
 * View user's job applications using atomic design components
 */

import React from 'react'
import { useRouter } from 'next/navigation'
import { ApplicationList } from '@/components/organisms'
import { Application } from '@/interfaces'

export default function MyApplicationsPage() {
  const router = useRouter()

  const handleApplicationClick = (application: Application) => {
    router.push(`/applications/${application._id || application.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-gray-600">
            Track the status of your job applications
          </p>
        </div>

        <ApplicationList
          viewMode="applicant"
          onApplicationClick={handleApplicationClick}
        />
      </div>
    </div>
  )
}
