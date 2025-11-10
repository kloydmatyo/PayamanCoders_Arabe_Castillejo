/**
 * Example: Refactored Jobs Page using custom hooks
 * This demonstrates how to replace direct fetch calls with custom hooks
 */

'use client'

import { useState } from 'react'
import { MapPin, Clock, DollarSign, Users, Search } from 'lucide-react'
import Link from 'next/link'

// Import the new hooks and interfaces
import { useJobs, useApplyToJob } from '@/hooks'
import { useDebounce } from '@/hooks/useBaseHooks'
import type { Job, JobQueryParams } from '@/interfaces'

export default function RefactoredJobsPage() {
  // Filter state
  const [filters, setFilters] = useState<JobQueryParams>({
    type: undefined,
    location: '',
    remote: undefined,
    skills: '',
    search: '',
    page: 1,
    limit: 10,
  })

  // Debounce search to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300)

  // Use the custom hook for fetching jobs
  const { 
    jobs, 
    pagination, 
    loading, 
    error, 
    refetch 
  } = useJobs(debouncedFilters)

  // Use the custom hook for applying to jobs
  const { 
    applyToJob, 
    loading: applyingLoading, 
    error: applyError 
  } = useApplyToJob()

  // Handle filter changes
  const handleFilterChange = (key: keyof JobQueryParams, value: any) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  // Handle job application
  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId, 'I am interested in this position and would like to apply.')
      alert('Application submitted successfully!')
      refetch() // Refresh jobs list to update application status
    } catch (error) {
      alert(applyError || 'Failed to submit application')
    }
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Opportunity</h1>
        <p className="text-gray-600">
          Discover internships, apprenticeships, and job opportunities that match your skills and goals.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Jobs
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, company, or skills..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Job Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          {/* Remote Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.remote === undefined ? '' : filters.remote.toString()}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : e.target.value === 'true'
                handleFilterChange('remote', value)
              }}
            >
              <option value="">All</option>
              <option value="true">Remote</option>
              <option value="false">On-site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button 
            onClick={refetch}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No jobs found matching your criteria.</p>
            <button 
              onClick={() => setFilters({ page: 1, limit: 10 })}
              className="mt-2 text-blue-600 hover:text-blue-800 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard 
              key={job._id} 
              job={job} 
              onApply={handleApply}
              isApplying={applyingLoading}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(pagination.currentPage! - 1)}
            disabled={!pagination.hasPrev}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(pagination.currentPage! + 1)}
            disabled={!pagination.hasNext}
            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Job Card Component
 */
interface JobCardProps {
  job: Job
  onApply: (jobId: string) => void
  isApplying: boolean
}

function JobCard({ job, onApply, isApplying }: JobCardProps) {
  const formatSalary = (salary?: Job['salary']) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salary not specified'
    
    const currency = salary.currency || 'PHP'
    const period = salary.period || 'monthly'
    
    if (salary.min && salary.max) {
      return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${period}`
    }
    
    return `${currency} ${(salary.min || salary.max)?.toLocaleString()} ${period}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link 
            href={`/jobs/${job._id}`}
            className="text-xl font-semibold text-blue-600 hover:text-blue-800"
          >
            {job.title}
          </Link>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        
        <div className="text-right">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            job.type === 'full-time' ? 'bg-green-100 text-green-800' :
            job.type === 'part-time' ? 'bg-blue-100 text-blue-800' :
            job.type === 'contract' ? 'bg-purple-100 text-purple-800' :
            job.type === 'freelance' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.type}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {job.remote ? 'Remote' : job.location}
        </div>
        
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          {formatSalary(job.salary)}
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Posted {formatDate(job.createdAt)}
        </div>
        
        {job.applicantCount !== undefined && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {job.applicantCount} applicants
          </div>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <Link 
          href={`/jobs/${job._id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </Link>
        
        <button
          onClick={() => onApply(job._id!)}
          disabled={isApplying}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isApplying ? 'Applying...' : 'Apply Now'}
        </button>
      </div>
    </div>
  )
}