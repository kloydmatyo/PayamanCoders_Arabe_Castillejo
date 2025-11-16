'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { MapPin, Clock, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

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
  skills: string[]
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    remote: '',
    skills: '',
  })
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [filters, searchQuery])

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      
      // Add search query if present
      if (searchQuery) {
        params.append('search', searchQuery)
      }
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/jobs?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverLetter: 'I am interested in this position and would like to apply.'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert('Application submitted successfully!')
        // Optionally refresh the jobs list or redirect to dashboard
      } else {
        alert(data.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error applying to job:', error)
      alert('An error occurred while submitting your application')
    }
  }

  return (
    <div className="hero-gradient relative overflow-hidden py-24">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-5%] h-[28rem] w-[28rem] rounded-full bg-primary-500/15 blur-3xl"></div>
        <div className="absolute right-[-20%] bottom-[-5%] h-[30rem] w-[30rem] rounded-full bg-secondary-500/15 blur-[140px]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className={`hero-panel space-y-10 auth-panel-pulse ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="auth-holo-grid" aria-hidden="true" />

          <div className="space-y-5 text-center">
            <h1 className="auth-title text-5xl md:text-[3.5rem]">Find Your Next Opportunity</h1>
            <p className="auth-subtitle text-lg md:text-xl">
              Discover internships, apprenticeships, and career opportunities aligned with your skills and growth goals.
            </p>
          </div>

          <div className="space-y-6 rounded-[2.5rem] border border-white/35 bg-white/70 p-10 shadow-[0_55px_120px_-65px_rgba(37,99,235,0.55)] backdrop-blur-2xl">
            {/* Search Bar */}
            <div className="space-y-3 text-left">
              <label className="auth-label" htmlFor="search">
                Search Jobs
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by job title, company, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input text-lg"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="space-y-3 text-left">
                <label className="auth-label" htmlFor="type">
                  Job Type
                </label>
                <select
                  id="type"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="glass-input"
                >
                  <option value="">All Types</option>
                  <option value="internship">Internship</option>
                  <option value="apprenticeship">Apprenticeship</option>
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div className="space-y-3 text-left">
                <label className="auth-label" htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="Enter city or state"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="glass-input"
                />
              </div>

              <div className="space-y-3 text-left">
                <label className="auth-label" htmlFor="remote">
                  Remote Work
                </label>
                <select
                  id="remote"
                  value={filters.remote}
                  onChange={(e) => handleFilterChange('remote', e.target.value)}
                  className="glass-input"
                >
                  <option value="">All Options</option>
                  <option value="true">Remote Only</option>
                  <option value="false">On-site Only</option>
                </select>
              </div>

              <div className="space-y-3 text-left">
                <label className="auth-label" htmlFor="skills">
                  Skills
                </label>
                <input
                  id="skills"
                  type="text"
                  placeholder="e.g. JavaScript, React"
                  value={filters.skills}
                  onChange={(e) => handleFilterChange('skills', e.target.value)}
                  className="glass-input"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/40 bg-white/70 py-16 shadow-[0_55px_120px_-65px_rgba(37,99,235,0.55)] backdrop-blur-2xl">
              <div className="h-14 w-14 animate-spin rounded-full border-b-2 border-primary-600"></div>
              <p className="mt-6 text-lg text-secondary-600">Loading jobs...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.length === 0 ? (
                <div className="rounded-[2.5rem] border border-white/40 bg-white/70 py-16 text-center shadow-[0_50px_110px_-65px_rgba(37,99,235,0.55)] backdrop-blur-2xl">
                  <p className="text-lg text-secondary-600">
                    No jobs found matching your criteria. Try adjusting your filters or check back later.
                  </p>
                </div>
              ) : (
                jobs.map((job, index) => (
                  <div
                    key={job._id}
                    className="feature-card group space-y-6"
                    style={{ '--float-delay': `${0.08 * index}s` } as CSSProperties}
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-lg text-secondary-600">{job.company}</p>
                      </div>
                      <span className="rounded-full border border-primary-500/40 bg-primary-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary-600">
                        {job.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <p className="text-secondary-600">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-5 text-secondary-500">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary-500" />
                        {job.location} {job.remote && '(Remote)'}
                      </span>

                      {job.salary && typeof job.salary.min === 'number' && typeof job.salary.max === 'number' && (
                        <span className="inline-flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary-500" />
                          ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary-500" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-full border border-primary-500/30 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
                      <button onClick={() => handleApply(job._id)} className="btn-primary auth-button px-8 py-3">
                        Apply Now
                      </button>
                      <Link href={`/jobs/${job._id}`} className="auth-link">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}