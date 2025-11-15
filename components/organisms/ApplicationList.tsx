/**
 * ApplicationList Organism Component
 * Complete application listing with filters and pagination
 */

import React, { useState } from 'react'
import { ApplicationCard, Pagination, EmptyState } from '@/components/molecules'
import { Spinner, Badge } from '@/components/atoms'
import { ApplicationListProps } from '@/interfaces'
import { useApplications } from '@/hooks/useApplications'
import { useUpdateApplicationStatus } from '@/hooks/useApplications'

export const ApplicationList: React.FC<ApplicationListProps> = ({
  viewMode = 'applicant',
  initialFilters = {},
  onApplicationClick,
}) => {
  const [filters, setFilters] = useState(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)

  const queryParams = {
    ...filters,
    page: currentPage,
    limit: 10,
  }

  const { applications, pagination, loading, error, refetch } = useApplications(queryParams)
  const { updateStatus, loading: updating } = useUpdateApplicationStatus()

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatus(id, { status: status as any })
      refetch()
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleFilterChange = (status: string) => {
    setFilters((prev: any) => ({
      ...prev,
      status: status || undefined,
    }))
    setCurrentPage(1)
  }

  const statusCounts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewed: applications.filter((a) => a.status === 'reviewed').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  if (loading && applications.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Applications"
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
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !filters.status
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({statusCounts.all})
        </button>
        <button
          onClick={() => handleFilterChange('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filters.status === 'pending'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({statusCounts.pending})
        </button>
        <button
          onClick={() => handleFilterChange('reviewed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filters.status === 'reviewed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reviewed ({statusCounts.reviewed})
        </button>
        <button
          onClick={() => handleFilterChange('accepted')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filters.status === 'accepted'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Accepted ({statusCounts.accepted})
        </button>
        <button
          onClick={() => handleFilterChange('rejected')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filters.status === 'rejected'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Rejected ({statusCounts.rejected})
        </button>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          description={
            viewMode === 'applicant'
              ? "You haven't applied to any jobs yet."
              : 'No applications received for your jobs yet.'
          }
          icon={
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
      ) : (
        <>
          <div className="grid gap-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application._id || application.id}
                application={application}
                viewMode={viewMode}
                onView={onApplicationClick}
                onUpdateStatus={viewMode === 'employer' ? handleStatusUpdate : undefined}
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
