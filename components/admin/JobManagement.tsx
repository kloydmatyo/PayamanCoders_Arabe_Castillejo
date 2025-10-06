'use client'

import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Users,
  AlertCircle,
  ExternalLink,
  Globe
} from 'lucide-react'

interface Job {
  _id: string
  title: string
  company: string
  type: string
  location: string
  remote: boolean
  status: 'active' | 'inactive' | 'closed'
  applicantCount: number
  views?: number
  salaryMin?: number
  salaryMax?: number
  description?: string
  requirements?: string[]
  createdAt: string
  employer: {
    firstName?: string
    lastName?: string
    email: string
  }
}

interface JobDetailsModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
}

function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  if (!isOpen || !job) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Job Header */}
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {job.company}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
                {job.remote && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Globe className="h-3 w-3 mr-1" />
                    Remote
                  </span>
                )}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Job Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                <span className="mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {job.type}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  job.status === 'active' ? 'bg-green-100 text-green-800' :
                  job.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {job.status}
                </span>
              </div>

              {(job.salaryMin || job.salaryMax) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {job.salaryMin && job.salaryMax 
                      ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
                      : job.salaryMin 
                      ? `From $${job.salaryMin.toLocaleString()}`
                      : `Up to $${job.salaryMax?.toLocaleString()}`
                    }
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Applications</label>
                <div className="mt-1 flex items-center text-sm text-gray-900">
                  <Users className="h-4 w-4 mr-1" />
                  {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                </div>
              </div>

              {job.views && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Views</label>
                  <div className="mt-1 flex items-center text-sm text-gray-900">
                    <Eye className="h-4 w-4 mr-1" />
                    {job.views} view{job.views !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employer Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {job.employer.firstName?.[0] || 'E'}{job.employer.lastName?.[0] || 'E'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {job.employer.firstName || 'Unknown'} {job.employer.lastName || 'Employer'}
                  </div>
                  <div className="text-sm text-gray-500">{job.employer.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {job.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-700">{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function JobManagement() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'closed'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const itemsPerPage = 10

  useEffect(() => {
    fetchJobs()
  }, [currentPage, searchTerm, statusFilter])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      })

      const response = await fetch(`/api/admin/jobs?${params}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        setError('Failed to load jobs')
      }
    } catch (error) {
      setError('Error loading jobs')
      console.error('Jobs fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleJobAction = async (jobId: string, action: 'activate' | 'deactivate' | 'close' | 'delete') => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return
    }

    if (action === 'close' && !confirm('Are you sure you want to close this job? It will no longer accept applications.')) {
      return
    }

    try {
      setActionLoading(jobId)
      setError('')
      setSuccess('')

      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setSuccess(`Job ${action}d successfully`)
        await fetchJobs() // Refresh the list
      } else {
        const data = await response.json()
        setError(data.error || `Failed to ${action} job`)
      }
    } catch (error) {
      setError(`Error performing ${action}`)
    } finally {
      setActionLoading(null)
    }
  }

  const exportJobs = async () => {
    try {
      setActionLoading('export')
      const response = await fetch('/api/admin/export/jobs', {
        credentials: 'include'
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `jobs_export_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setSuccess('Jobs exported successfully')
      } else {
        setError('Failed to export jobs')
      }
    } catch (error) {
      setError('Error exporting jobs')
    } finally {
      setActionLoading(null)
    }
  }

  const viewJobDetails = (job: Job) => {
    setSelectedJob(job)
    setShowJobDetails(true)
  } 
 return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <p className="text-sm text-gray-500">Oversee job postings and applications</p>
        </div>
        <button
          onClick={exportJobs}
          disabled={actionLoading === 'export'}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {actionLoading === 'export' ? 'Exporting...' : 'Export Jobs'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any)
                setCurrentPage(1)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.company}</div>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                          {job.remote && (
                            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Remote
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.employer.firstName || 'Unknown'} {job.employer.lastName || 'Employer'}
                      </div>
                      <div className="text-sm text-gray-500">{job.employer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : job.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicantCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewJobDetails(job)}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {job.status === 'active' ? (
                          <button
                            onClick={() => handleJobAction(job._id, 'deactivate')}
                            disabled={actionLoading === job._id}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                            title="Deactivate"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJobAction(job._id, 'activate')}
                            disabled={actionLoading === job._id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Activate"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {job.status !== 'closed' && (
                          <button
                            onClick={() => handleJobAction(job._id, 'close')}
                            disabled={actionLoading === job._id}
                            className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                            title="Close Job"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleJobAction(job._id, 'delete')}
                          disabled={actionLoading === job._id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete Job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        isOpen={showJobDetails}
        onClose={() => {
          setShowJobDetails(false)
          setSelectedJob(null)
        }}
      />
    </div>
  )
}