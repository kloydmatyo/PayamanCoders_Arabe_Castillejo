/**
 * JobList Organism Component
 * Complete job listing with search, filters, and pagination
 */

import React, { useState } from 'react'
import { JobCard, SearchBar, Pagination, EmptyState } from '@/components/molecules'
import { Spinner } from '@/components/atoms'
import { JobListProps } from '@/interfaces'
import { useJobs } from '@/hooks/useJobs'

export const JobList: React.FC<JobListProps> = ({
  initialFilters = {},
  onJobClick,
  onJobApply,
  showSearch = true,
  showFilters = true,
}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const queryParams = {
    ...filters,
    search: searchTerm,
    page: currentPage,
    limit: 10,
  }

  const { jobs, pagination, loading, error } = useJobs(queryParams)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [name]: value || undefined,
    }))
    setCurrentPage(1)
  }

  const searchFilters = showFilters
    ? [
        {
          name: 'type',
          label: 'Job Type',
          type: 'select' as const,
          options: [
            { label: 'Full Time', value: 'full-time' },
            { label: 'Part Time', value: 'part-time' },
            { label: 'Contract', value: 'contract' },
            { label: 'Freelance', value: 'freelance' },
            { label: 'Internship', value: 'internship' },
          ],
        },
        {
          name: 'location',
          label: 'Location',
          type: 'text' as const,
        },
        {
          name: 'remote',
          label: 'Remote',
          type: 'select' as const,
          options: [
            { label: 'Remote Only', value: 'true' },
            { label: 'On-site Only', value: 'false' },
          ],
        },
      ]
    : undefined

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Jobs"
        description={error}
        icon={
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      {showSearch && (
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search jobs by title, company, or skills..."
          showFilters={showFilters}
          filters={searchFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      {jobs.length === 0 ? (
        <EmptyState
          title="No Jobs Found"
          description="Try adjusting your search or filters to find more jobs."
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job._id || job.id}
                job={job}
                onView={() => onJobClick?.(job)}
                onApply={() => onJobApply?.(job)}
              />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  )
}
