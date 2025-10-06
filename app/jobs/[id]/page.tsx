'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Clock, DollarSign, Building, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import JobApplicationModal from '@/components/JobApplicationModal'
import { useAuth } from '@/contexts/AuthContext'

interface Job {
  _id: string
  title: string
  description: string
  company: string
  type: string
  location: string
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  requirements: string[]
  skills: string[]
  duration?: string
  createdAt: string
  employerId: {
    firstName: string
    lastName: string
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string)
      if (user?.role === 'job_seeker') {
        checkApplicationStatus(params.id as string)
      }
    }
  }, [params.id, user])

  const fetchJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`)
      if (response.ok) {
        const data = await response.json()
        setJob(data.job)
      } else {
        setError('Job not found')
      }
    } catch (error) {
      console.error('Error fetching job:', error)
      setError('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }

  const checkApplicationStatus = async (jobId: string) => {
    try {
      const response = await fetch('/api/dashboard/applications', {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        const hasAppliedToJob = data.applications?.some((app: any) => app.job._id === jobId)
        setHasApplied(hasAppliedToJob)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const handleApplyClick = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'job_seeker') {
      alert('Only job seekers can apply to jobs.')
      return
    }

    setShowApplicationModal(true)
  }

  const handleApplicationSuccess = () => {
    setHasApplied(true)
    setShowApplicationModal(false)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error || 'Job not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/jobs"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building className="w-5 h-5 mr-2" />
                <span className="text-lg font-medium">{job.company}</span>
              </div>
            </div>
            <span className="bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
              {job.type.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Location</p>
                <p>{job.location} {job.remote && '(Remote)'}</p>
              </div>
            </div>

            {job.salary && typeof job.salary.min === 'number' && typeof job.salary.max === 'number' && (
              <div className="flex items-center text-gray-600">
                <DollarSign className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Salary</p>
                  <p>${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}</p>
                </div>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-3" />
              <div>
                <p className="font-medium">Posted</p>
                <p>{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-8">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Posted by {job.employerId.firstName} {job.employerId.lastName}
              </div>
              
              {user?.role === 'job_seeker' ? (
                hasApplied ? (
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                      ✓ Applied
                    </span>
                    <Link
                      href="/applications"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Application
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="btn-primary"
                  >
                    Apply Now
                  </button>
                )
              ) : user?.role === 'employer' ? (
                <div className="text-sm text-gray-500">
                  <Link
                    href={`/jobs/${job._id}/applicants`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Applicants
                  </Link>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="btn-primary"
                >
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {job && (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          jobId={job._id}
          jobTitle={job.title}
          company={job.company}
          onSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  )
}