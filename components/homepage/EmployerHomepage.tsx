'use client'

import React, { useEffect, useState, CSSProperties } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Users,
  BarChart2,
  Search,
  PlusCircle,
  FileText,
  LifeBuoy,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Job {
  _id: string
  title: string
  company: string
  location?: string
  type?: string
  remote?: boolean
  status?: string
  createdAt?: string
  applicantCount?: number
}

interface Applicant {
  _id: string
  firstName: string
  lastName: string
  role?: string
  appliedAt?: string
  status?: string
}

export default function EmployerHomepage() {
  const { user } = useAuth()

  const [jobs, setJobs] = useState<Job[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [stats, setStats] = useState({
    jobs: 0,
    applicants: 0,
    interviews: 0,
    offers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search & filters
  const [query, setQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed'>(
    'all'
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [jobsRes, appsRes, statsRes] = await Promise.all([
        fetch('/api/jobs?employer=true', { credentials: 'include' }),
        fetch('/api/dashboard/applications', { credentials: 'include' }),
        fetch('/api/dashboard/stats', { credentials: 'include' }),
      ])

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json()
        setJobs(jobsData.jobs || jobsData || [])
      }

      if (appsRes.ok) {
        const appsData = await appsRes.json()
        // normalize applicants list (keep most recent 6)
        const flatApps = (appsData.applications || [])
          .slice(0, 6)
          .map((a: any) => ({
            _id: a._id || a.id,
            firstName: a.applicant?.firstName || a.applicantName || 'Applicant',
            lastName: a.applicant?.lastName || '',
            role: a.jobTitle || '',
            appliedAt: a.createdAt || a.appliedDate,
            status: a.status || 'pending',
          }))
        setApplicants(flatApps)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          jobs: statsData.jobs || (jobsRes.ok ? (await jobsRes.json()).length : 0),
          applicants: statsData.applications || 0,
          interviews: statsData.interviews || 0,
          offers: statsData.offers || 0,
        })
      }
    } catch (err) {
      console.error(err)
      setError('Failed to load employer data.')
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter((j) => {
    const matchesQuery =
      query.trim() === '' ||
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(query.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || (j.status || 'active') === filterStatus
    return matchesQuery && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        <div className="auth-background-grid"></div>
        <div className="auth-entry-overlay"></div>
        <div className="futuristic-loader">
          <div className="futuristic-loader-inner"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      <div className="auth-background-grid"></div>
      <div className="auth-entry-overlay"></div>
      
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8 auth-panel flex flex-col gap-5 md:flex-row md:items-center md:justify-between max-w-5xl mx-auto" style={{ '--float-delay': '0.1s' } as CSSProperties}>
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h1 className="auth-title text-2xl md:text-3xl font-bold mb-2 leading-tight">
              Employer Portal{user ? ` — ${user.firstName || user.company || 'company'}` : ''}
            </h1>
            <p className="auth-subtitle text-xs md:text-sm text-secondary-600/90 leading-relaxed">
              Manage your company, job listings, applicants, and hiring analytics
              from one place.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 flex-shrink-0">
            <Link
              href="/jobs/new"
              className="btn-primary px-5 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              Post a job
            </Link>

            <Link
              href="/profile/company"
              className="btn-secondary px-5 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group whitespace-nowrap"
            >
              <Users className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              Company Settings
            </Link>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="stat-card flex items-center gap-5 p-6" style={{ '--float-delay': '0.2s' } as CSSProperties}>
            <div className="feature-icon flex-shrink-0">
              <Briefcase className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="stat-label break-words text-xs">Active Jobs</div>
              <div className="stat-number">{stats.jobs}</div>
            </div>
          </div>

          <div className="stat-card flex items-center gap-5 p-6" style={{ '--float-delay': '0.3s' } as CSSProperties}>
            <div className="feature-icon flex-shrink-0">
              <FileText className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="stat-label break-words text-xs">Total Applicants</div>
              <div className="stat-number">{stats.applicants}</div>
            </div>
          </div>

          <div className="stat-card flex items-center gap-5 p-6" style={{ '--float-delay': '0.4s' } as CSSProperties}>
            <div className="feature-icon flex-shrink-0">
              <Clock className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="stat-label break-words text-xs">Interviews</div>
              <div className="stat-number">{stats.interviews}</div>
            </div>
          </div>

          <div className="stat-card flex items-center gap-5 p-6" style={{ '--float-delay': '0.5s' } as CSSProperties}>
            <div className="feature-icon flex-shrink-0">
              <BarChart2 className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="stat-label break-words text-xs">Offers</div>
              <div className="stat-number">{stats.offers}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Company overview & help */}
          <div className="space-y-6">
            <div className="card relative overflow-hidden group p-8 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" style={{ '--float-delay': '0.6s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="feature-heading text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300">Company Overview</h3>
                  </div>
                  {user?.verification?.status === 'verified' ? (
                    <div className="rounded-full border border-green-500/60 bg-green-500/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-green-600 shadow-lg shadow-green-500/40 animate-pulse group-hover:shadow-xl group-hover:shadow-green-500/50 transition-all duration-300">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        Verified
                      </span>
                    </div>
                  ) : user?.verification?.status === 'pending' ? (
                    <div className="rounded-full border border-yellow-500/60 bg-yellow-500/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-yellow-600 shadow-lg shadow-yellow-500/40 animate-pulse group-hover:shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                        Pending
                      </span>
                    </div>
                  ) : user?.verification?.status === 'rejected' || user?.verification?.status === 'suspended' ? (
                    <div className="rounded-full border border-red-500/60 bg-red-500/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 shadow-lg shadow-red-500/40 group-hover:shadow-xl group-hover:shadow-red-500/50 transition-all duration-300">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        {user?.verification?.status === 'suspended' ? 'Suspended' : 'Rejected'}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-full border border-gray-500/60 bg-gray-500/25 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 shadow-lg shadow-gray-500/40 group-hover:shadow-xl group-hover:shadow-gray-500/50 transition-all duration-300">
                      <span className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                        Unverified
                      </span>
                    </div>
                  )}
                </div>
                <p className="auth-subtitle text-base text-secondary-600/90 mb-7 leading-relaxed">
                  {user?.role === 'employer'
                    ? 'Share your company mission, values, and what makes you a great place to work. Update your company profile to attract the right candidates.'
                    : 'Complete your company profile to enable fuller features.'}
                </p>
                <Link
                  href="/profile/company"
                  className="auth-link text-base font-semibold inline-flex items-center gap-2 group/link"
                >
                  <span>Edit company profile</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>

            <div className="card relative overflow-hidden group p-8 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" style={{ '--float-delay': '0.7s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="feature-heading text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300">Team & Collaboration</h3>
                </div>
                <p className="auth-subtitle text-base text-secondary-600/90 mb-6 leading-relaxed">
                  Invite teammates, assign roles (recruiter, hiring manager), and collaborate on candidates.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/team"
                    className="btn-secondary px-6 py-3 text-base font-semibold group/btn hover:shadow-xl hover:shadow-primary-500/30"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      Manage team
                    </span>
                  </Link>
                  <Link
                    href="/team/roles"
                    className="btn-ghost px-6 py-3 text-base font-semibold group/btn"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                      Assign roles
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="card relative overflow-hidden group p-8 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500" style={{ '--float-delay': '0.8s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-5">
                  <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500">
                    <LifeBuoy className="h-6 w-6" />
                  </div>
                  <h3 className="feature-heading text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300">Help & Support</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <Link href="/help/faqs" className="auth-link text-base font-semibold inline-flex items-center gap-3 group/link hover:translate-x-1 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-primary-500 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-150 group-hover/link:shadow-lg group-hover/link:shadow-primary-500/50 transition-all duration-300"></div>
                      <span>FAQs</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help/contact" className="auth-link text-base font-semibold inline-flex items-center gap-3 group/link hover:translate-x-1 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-primary-500 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-150 group-hover/link:shadow-lg group-hover/link:shadow-primary-500/50 transition-all duration-300"></div>
                      <span>Contact support</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/help/guides" className="auth-link text-base font-semibold inline-flex items-center gap-3 group/link hover:translate-x-1 transition-transform duration-300">
                      <div className="h-2 w-2 rounded-full bg-primary-500 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-150 group-hover/link:shadow-lg group-hover/link:shadow-primary-500/50 transition-all duration-300"></div>
                      <span>Hiring guides</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Center: Jobs list with search & filters */}
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500" style={{ '--float-delay': '0.6s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div className="relative flex w-full items-center sm:max-w-md group/search">
                    <span className="pointer-events-none absolute left-5 text-primary-500 group-hover/search:text-primary-600 transition-colors duration-300 z-10">
                      <Search className="h-6 w-6" />
                    </span>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="glass-input w-full pl-14 pr-5 py-4 text-base font-medium transition-all duration-300 group-hover/search:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                      placeholder="Search jobs or companies..."
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <select
                      value={filterStatus}
                      onChange={(e) =>
                        setFilterStatus(e.target.value as 'all' | 'active' | 'closed')
                      }
                      className="glass-input px-5 py-4 text-base font-medium appearance-none bg-white/70 cursor-pointer transition-all duration-300 hover:border-primary-500/50 focus:border-primary-500/70 focus:shadow-lg focus:shadow-primary-500/20"
                    >
                      <option value="all">All statuses</option>
                      <option value="active">Active</option>
                      <option value="closed">Closed</option>
                    </select>

                    <Link
                      href="/jobs/new"
                      className="btn-primary px-5 py-3 text-sm font-semibold group/btn hover:shadow-xl hover:shadow-primary-500/40"
                    >
                      <PlusCircle className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                      New job
                    </Link>
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/30 pt-6">
                  {loading ? (
                    <div className="text-base text-secondary-500 text-center py-8">Loading jobs…</div>
                  ) : filteredJobs.length === 0 ? (
                    <div className="text-base text-secondary-500 text-center py-8">No jobs found.</div>
                  ) : (
                    filteredJobs.map((job, index) => (
                      <div
                        key={job._id}
                        className="feature-card flex items-center justify-between p-6 group/job hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500"
                        style={{ '--float-delay': `${0.7 + index * 0.1}s` } as CSSProperties}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-xl text-gray-900 mb-2 group-hover/job:text-primary-600 transition-colors duration-300">{job.title}</div>
                          <div className="text-base text-secondary-600/90 mb-3 flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary-500/60"></div>
                              {job.company}
                            </span>
                            <span>•</span>
                            <span>{job.location || 'Remote'}</span>
                            <span>•</span>
                            <span>{job.type || '—'}</span>
                          </div>
                          {typeof job.applicantCount === 'number' && (
                            <div className="text-base font-semibold text-primary-600 flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span
                            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                              job.status === 'active'
                                ? 'bg-green-500/20 text-green-600 border border-green-500/40 shadow-lg shadow-green-500/20 group-hover/job:shadow-xl group-hover/job:shadow-green-500/30'
                                : 'bg-gray-500/20 text-gray-600 border border-gray-500/40 shadow-lg shadow-gray-500/20 group-hover/job:shadow-xl group-hover/job:shadow-gray-500/30'
                            }`}
                          >
                            {job.status || 'active'}
                          </span>

                          <Link
                            href={`/jobs/${job._id}/applicants`}
                            className="auth-link text-base font-semibold group/link"
                          >
                            <span className="flex items-center gap-2">
                              View Applicants
                              <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                            </span>
                          </Link>

                          <Link
                            href={`/jobs/${job._id}`}
                            className="text-base text-secondary-600/90 font-semibold transition-colors hover:text-primary-600 group/edit"
                          >
                            <span className="flex items-center gap-2">
                              Edit
                              <div className="h-1 w-1 rounded-full bg-primary-500 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-300"></div>
                            </span>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Applicant management */}
            <div className="card p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 animate-[floatUp_0.8s_ease-out_0.8s_both]" style={{ '--float-delay': '0.8s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <Users className="h-6 w-6 relative z-10" />
                    </div>
                    <h3 className="feature-heading text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text group-hover:from-primary-600 group-hover:via-primary-500 group-hover:to-primary-600">
                      Recent Applicants
                    </h3>
                  </div>
                  <Link
                    href="/applications"
                    className="auth-link text-base font-semibold group/link"
                  >
                    <span className="flex items-center gap-2">
                      View all
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                    </span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {applicants.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/50 p-8 text-center text-base text-secondary-500 backdrop-blur relative overflow-hidden group/empty animate-[floatUp_0.6s_ease-out_1s_both]">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute inset-0 border border-primary-500/20 group-hover/empty:border-primary-500/40 transition-all duration-500 rounded-2xl"></div>
                      <div className="relative flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full border border-primary-500/30 bg-primary-500/10 flex items-center justify-center relative group-hover/empty:scale-110 transition-transform duration-500">
                          <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-md opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500"></div>
                          <Users className="h-6 w-6 text-primary-500/60 relative z-10" />
                        </div>
                        <span className="font-medium">No recent applicants</span>
                      </div>
                    </div>
                  ) : (
                    applicants.map((a, index) => (
                      <div
                        key={a._id}
                        className="feature-card flex items-center justify-between p-6 group/applicant hover:scale-[1.01] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500"
                        style={{ '--float-delay': `${0.9 + index * 0.1}s` } as CSSProperties}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-lg text-gray-900 mb-2 group-hover/applicant:text-primary-600 transition-colors duration-300">
                            {a.firstName} {a.lastName}
                          </div>
                          <div className="text-base text-secondary-600/90 flex items-center gap-2 flex-wrap">
                            <span>Applied to {a.role || '—'}</span>
                            <span>•</span>
                            <span>{new Date(a.appliedAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0">
                          <Link
                            href={`/applications/${a._id}`}
                            className="auth-link text-base font-semibold group/link"
                          >
                            <span className="flex items-center gap-2">
                              Review
                              <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                            </span>
                          </Link>
                          <button
                            onClick={() => {
                              // quick shortlist (optimistic UI)
                              // in a real implementation call API here
                              alert(`Shortlisted ${a.firstName} ${a.lastName}`)
                            }}
                            className="rounded-full bg-green-500/20 border border-green-500/40 px-5 py-2.5 text-sm font-bold text-green-600 shadow-lg shadow-green-500/20 hover:bg-green-500/30 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300"
                          >
                            Shortlist
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Analytics preview */}
            <div className="card p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 animate-[floatUp_0.8s_ease-out_0.9s_both]" style={{ '--float-delay': '0.9s' } as CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500/30 transition-all duration-500 rounded-2xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="feature-icon group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-500 relative">
                      <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <BarChart2 className="h-6 w-6 relative z-10" />
                    </div>
                    <h3 className="feature-heading text-2xl font-bold group-hover:text-primary-600 transition-colors duration-300 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text group-hover:from-primary-600 group-hover:via-primary-500 group-hover:to-primary-600">
                      Hiring Analytics
                    </h3>
                  </div>
                  <Link
                    href="/analytics"
                    className="auth-link text-base font-semibold group/link"
                  >
                    <span className="flex items-center gap-2">
                      See full report
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-500 opacity-0 group-hover/link:opacity-100 animate-pulse transition-opacity duration-300"></div>
                    </span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="feature-card p-6 group/metric hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden animate-[floatUp_0.6s_ease-out_1.1s_both]">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="stat-label mb-3 text-xs">Applications / Week</div>
                      <div className="stat-number text-4xl mb-2">34</div>
                      <div className="text-sm font-bold text-green-600 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                        +8% vs last week
                      </div>
                    </div>
                  </div>
                  <div className="feature-card p-6 group/metric hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-500 relative overflow-hidden animate-[floatUp_0.6s_ease-out_1.2s_both]">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="stat-label mb-3 text-xs">Avg Time to Hire</div>
                      <div className="stat-number text-4xl mb-2">21 days</div>
                      <div className="text-sm font-bold text-red-500 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                        +2 days vs target
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}