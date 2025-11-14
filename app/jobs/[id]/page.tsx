'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Clock, DollarSign, Building, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import JobApplicationModal from '@/components/JobApplicationModal'
import JobMatchScore from '@/components/ai/JobMatchScore'
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
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string)
      if (user?.role === 'job_seeker') {
        checkApplicationStatus(params.id as string)
      }
    }
  }, [params.id, user])

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

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
    <div className="hero-gradient relative overflow-hidden py-24">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[26rem] w-[26rem] rounded-full bg-primary-500/15 blur-3xl"></div>
        <div className="absolute right-[-18%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-secondary-500/15 blur-[130px]"></div>
      </div>

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
        <div className={`hero-panel space-y-10 auth-panel-pulse ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="auth-holo-grid" aria-hidden="true" />

          <Link 
            href="/jobs"
            className="auth-link inline-flex items-center gap-3 uppercase tracking-[0.3em]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Jobs
          </Link>
          
          <div className="space-y-10 rounded-[2.5rem] border border-white/30 bg-white/70 p-10 shadow-[0_55px_120px_-65px_rgba(37,99,235,0.55)] backdrop-blur-2xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
              <div>
                <h1 className="auth-title text-[2.75rem] md:text-[3rem]">{job.title}</h1>
                <div className="mt-4 flex items-center gap-3 text-lg font-semibold text-secondary-600">
                  <Building className="h-6 w-6 text-primary-500" />
                  {job.company}
                </div>
              </div>
              <span className="rounded-full border border-primary-500/40 bg-primary-500/12 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-primary-600">
                {job.type.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div
                className="card group space-y-2 border-white/25 bg-white/70 p-7"
                style={{ '--float-delay': '0.05s' } as CSSProperties}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary-500">Location</span>
                <span className="flex items-center gap-2 text-secondary-600">
                  <MapPin className="h-5 w-5 text-primary-500" />
                  {job.location} {job.remote && '(Remote)'}
                </span>
              </div>

              {job.salary && typeof job.salary.min === 'number' && typeof job.salary.max === 'number' && (
                <div
                  className="card group space-y-2 border-white/25 bg-white/70 p-7"
                  style={{ '--float-delay': '0.12s' } as CSSProperties}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary-500">Salary</span>
                  <span className="flex items-center gap-2 text-secondary-600">
                    <DollarSign className="h-5 w-5 text-primary-500" />
                    ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                  </span>
                </div>
              )}

              <div
                className="card group space-y-2 border-white/25 bg-white/70 p-7"
                style={{ '--float-delay': '0.19s' } as CSSProperties}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.35em] text-secondary-500">Posted</span>
                <span className="flex items-center gap-2 text-secondary-600">
                  <Clock className="h-5 w-5 text-primary-500" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              {/* AI Match Score - Only for job seekers */}
              {user?.role === 'job_seeker' && (
                <div style={{ '--float-delay': '0.20s' } as CSSProperties}>
                  <JobMatchScore jobId={job._id} />
                </div>
              )}

              <section
                className="card space-y-4 border-white/25 bg-white/70 p-10"
                style={{ '--float-delay': '0.24s' } as CSSProperties}
              >
                <h2 className="text-2xl font-semibold text-gray-900">Job Description</h2>
                <p className="text-secondary-600 whitespace-pre-line">{job.description}</p>
              </section>

              {job.requirements.length > 0 && (
                <section
                  className="card space-y-4 border-white/25 bg-white/70 p-10"
                  style={{ '--float-delay': '0.32s' } as CSSProperties}
                >
                  <h2 className="text-2xl font-semibold text-gray-900">Requirements</h2>
                  <ul className="space-y-2 text-secondary-600">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-primary-500"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {job.skills.length > 0 && (
                <section
                  className="card space-y-4 border-white/25 bg-white/70 p-10"
                  style={{ '--float-delay': '0.4s' } as CSSProperties}
                >
                  <h2 className="text-2xl font-semibold text-gray-900">Required Skills</h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-primary-500/40 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div
              className="card border-white/25 bg-white/70 p-10"
              style={{ '--float-delay': '0.48s' } as CSSProperties}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm uppercase tracking-[0.3em] text-secondary-500">
                  Posted by {job.employerId.firstName} {job.employerId.lastName}
                </div>
                
                {user?.role === 'job_seeker' ? (
                  hasApplied ? (
                    <div className="flex flex-col items-center gap-3 text-sm uppercase tracking-[0.3em] text-secondary-600 md:flex-row">
                      <span className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-100/60 px-4 py-2 text-green-700">
                        ✓ Applied
                      </span>
                      <Link
                        href="/applications"
                        className="auth-link"
                      >
                        View Application
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleApplyClick}
                      className="btn-primary auth-button px-10 py-3"
                    >
                      Apply Now
                    </button>
                  )
                ) : user?.role === 'employer' ? (
                  <Link
                    href={`/jobs/${job._id}/applicants`}
                    className="auth-link"
                  >
                    View Applicants
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    className="btn-secondary auth-button px-10 py-3"
                  >
                    Login to Apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Application Modal */
      }
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