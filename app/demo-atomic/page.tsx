'use client'

/**
 * Atomic Design Demo Page
 * Demonstrates all atomic design components
 */

import React, { useState } from 'react'
import { Button, Input, Card, Badge, Spinner } from '@/components/atoms'
import { JobCard, ApplicationCard, SearchBar, Pagination, EmptyState } from '@/components/molecules'
import { Job, Application } from '@/interfaces'

export default function AtomicDesignDemoPage() {
  const [currentPage, setCurrentPage] = useState(1)

  // Sample data
  const sampleJob: Job = {
    _id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    description: 'We are looking for an experienced frontend developer...',
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    salary: {
      min: 120000,
      max: 180000,
      currency: 'USD',
      period: 'yearly',
    },
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    employerId: 'emp1',
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  const sampleApplication: Application = {
    _id: '1',
    jobId: '1',
    applicantId: 'user1',
    job: sampleJob,
    status: 'pending',
    coverLetter: 'I am very interested in this position...',
    createdAt: new Date().toISOString(),
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Atomic Design Pattern Demo
          </h1>
          <p className="text-lg text-gray-600">
            Showcasing reusable components built with Atomic Design principles
          </p>
        </div>

        {/* Atoms Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Atoms</h2>
          <Card variant="elevated" padding="lg">
            <div className="space-y-6">
              {/* Buttons */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Buttons</h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              {/* Inputs */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Inputs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Email" type="email" placeholder="Enter your email" />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    required
                  />
                  <Input
                    label="With Error"
                    type="text"
                    error="This field is required"
                  />
                  <Input
                    label="With Helper Text"
                    type="text"
                    helperText="This is a helper text"
                  />
                </div>
              </div>

              {/* Spinner */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Spinners</h3>
                <div className="flex gap-4 items-center">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>

              {/* Cards */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Cards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card variant="default" padding="md">
                    <p>Default Card</p>
                  </Card>
                  <Card variant="elevated" padding="md">
                    <p>Elevated Card</p>
                  </Card>
                  <Card variant="outlined" padding="md">
                    <p>Outlined Card</p>
                  </Card>
                  <Card variant="flat" padding="md">
                    <p>Flat Card</p>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Molecules Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Molecules</h2>
          <div className="space-y-6">
            {/* Search Bar */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Search Bar</h3>
              <SearchBar
                onSearch={(term: string) => console.log('Search:', term)}
                placeholder="Search for jobs..."
                showFilters={true}
                filters={[
                  {
                    name: 'type',
                    label: 'Job Type',
                    type: 'select',
                    options: [
                      { label: 'Full Time', value: 'full-time' },
                      { label: 'Part Time', value: 'part-time' },
                    ],
                  },
                ]}
              />
            </Card>

            {/* Job Card */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Job Card</h3>
              <JobCard
                job={sampleJob}
                onView={() => console.log('View job')}
                onApply={() => console.log('Apply to job')}
              />
            </Card>

            {/* Application Card */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Application Card</h3>
              <ApplicationCard
                application={sampleApplication}
                viewMode="applicant"
                onView={() => console.log('View application')}
              />
            </Card>

            {/* Pagination */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Pagination</h3>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </Card>

            {/* Empty State */}
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-semibold mb-4">Empty State</h3>
              <EmptyState
                title="No Results Found"
                description="Try adjusting your search criteria"
                actionLabel="Reset Filters"
                onAction={() => console.log('Reset')}
                icon={
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </Card>
          </div>
        </section>

        {/* Organisms Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Organisms</h2>
          <Card variant="elevated" padding="lg">
            <p className="text-gray-600">
              Organism components (JobList, ApplicationList) are demonstrated in their
              respective pages:
            </p>
            <div className="mt-4 space-y-2">
              <div>
                <Button variant="outline" onClick={() => window.location.href = '/jobs-browse'}>
                  View JobList Organism
                </Button>
              </div>
              <div>
                <Button variant="outline" onClick={() => window.location.href = '/my-applications'}>
                  View ApplicationList Organism
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
