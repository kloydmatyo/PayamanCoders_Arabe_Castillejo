'use client'

import React, { useEffect, useState } from 'react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/30 bg-white/60 p-6 shadow-xl shadow-primary-900/10 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employer Portal{user ? ` — ${user.firstName}` : ''}
            </h1>
            <p className="mt-2 text-sm text-secondary-600">
              Manage your company, job listings, applicants, and hiring analytics
              from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/jobs/new"
              className="btn-primary px-5 py-2"
            >
              <PlusCircle className="h-4 w-4" />
              Post a job
            </Link>

            <Link
              href="/profile/company"
              className="btn-secondary px-5 py-2"
            >
              <Users className="h-4 w-4" />
              Company Settings
            </Link>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-secondary-500">Active Jobs</div>
              <div className="text-xl font-semibold text-gray-900">{stats.jobs}</div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-secondary-500">Total Applicants</div>
              <div className="text-xl font-semibold text-gray-900">{stats.applicants}</div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-secondary-500">Interviews</div>
              <div className="text-xl font-semibold text-gray-900">{stats.interviews}</div>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary-500/30 bg-primary-500/15 text-primary-600 shadow-inner shadow-primary-900/10">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-secondary-500">Offers</div>
              <div className="text-xl font-semibold text-gray-900">{stats.offers}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Company overview & help */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Company Overview</h3>
                  <p className="mt-3 text-sm text-secondary-600">
                    {user?.role === 'employer'
                      ? 'Share your company mission, values, and what makes you a great place to work. Update your company profile to attract the right candidates.'
                      : 'Complete your company profile to enable fuller features.'}
                  </p>
                </div>
                {user?.verification?.status === 'verified' ? (
                  <div className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-600">
                    Verified
                  </div>
                ) : user?.verification?.status === 'pending' ? (
                  <div className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-yellow-600">
                    Pending
                  </div>
                ) : user?.verification?.status === 'rejected' || user?.verification?.status === 'suspended' ? (
                  <div className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                    {user?.verification?.status === 'suspended' ? 'Suspended' : 'Rejected'}
                  </div>
                ) : (
                  <div className="rounded-full border border-gray-500/40 bg-gray-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Unverified
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Link
                  href="/profile/company"
                  className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                >
                  Edit company profile
                </Link>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Team & Collaboration</h3>
              <p className="mb-4 text-sm text-secondary-600">
                Invite teammates, assign roles (recruiter, hiring manager), and collaborate on candidates.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/team"
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Manage team
                </Link>
                <Link
                  href="/team/roles"
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Assign roles
                </Link>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Help & Support</h3>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li>
                  <Link href="/help/faqs" className="text-primary-600 transition-colors hover:text-primary-500">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/help/contact" className="text-primary-600 transition-colors hover:text-primary-500">
                    Contact support
                  </Link>
                </li>
                <li>
                  <Link href="/help/guides" className="text-primary-600 transition-colors hover:text-primary-500">
                    Hiring guides
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Center: Jobs list with search & filters */}
          <div className="space-y-6 lg:col-span-2">
            <div className="surface-panel p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex w-full items-center sm:max-w-md">
                  <span className="pointer-events-none absolute left-4 text-secondary-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/40 bg-white/70 py-2.5 pl-11 pr-4 text-sm text-secondary-700 shadow-inner shadow-primary-900/5 focus:border-primary-500/60 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="Search jobs or companies..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(e.target.value as 'all' | 'active' | 'closed')
                    }
                    className="rounded-xl border border-white/40 bg-white/70 px-3 py-2 text-sm text-secondary-600 shadow-inner shadow-primary-900/5 focus:border-primary-500/50 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>

                  <Link
                    href="/jobs/new"
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New job
                  </Link>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/30 pt-4">
                {loading ? (
                  <div className="text-sm text-secondary-500">Loading jobs…</div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-sm text-secondary-500">No jobs found.</div>
                ) : (
                  filteredJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:border-primary-500/40 hover:bg-white/70"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-secondary-500">
                          {job.company} • {job.location || 'Remote'} • {job.type || '—'}
                        </div>
                        {typeof job.applicantCount === 'number' && (
                          <div className="mt-1 text-sm font-medium text-primary-600">
                            {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {job.status || 'active'}
                        </span>

                        <Link
                          href={`/jobs/${job._id}/applicants`}
                          className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                        >
                          View Applicants
                        </Link>

                        <Link
                          href={`/jobs/${job._id}`}
                          className="text-sm text-secondary-500 transition-colors hover:text-primary-500"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Applicant management */}
            <div className="surface-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Applicants</h3>
                </div>
                <Link
                  href="/applications"
                  className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-3">
                {applicants.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/50 p-6 text-center text-sm text-secondary-500 backdrop-blur">
                    No recent applicants
                  </div>
                ) : (
                  applicants.map((a) => (
                    <div
                      key={a._id}
                      className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-300 hover:border-primary-500/40"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {a.firstName} {a.lastName}
                        </div>
                        <div className="text-sm text-secondary-500">
                          Applied to {a.role || '—'} • {new Date(a.appliedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/applications/${a._id}`}
                          className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                        >
                          Review
                        </Link>
                        <button
                          onClick={() => {
                            // quick shortlist (optimistic UI)
                            // in a real implementation call API here
                            alert(`Shortlisted ${a.firstName} ${a.lastName}`)
                          }}
                          className="rounded-full bg-green-100/80 px-3 py-1 text-sm font-medium text-green-700 shadow-inner"
                        >
                          Shortlist
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Analytics preview */}
            <div className="surface-panel p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Hiring Analytics</h3>
                </div>
                <Link
                  href="/analytics"
                  className="text-sm font-semibold text-primary-600 transition-colors hover:text-primary-500"
                >
                  See full report
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-secondary-500">Applications / Week</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">34</div>
                  <div className="mt-1 text-xs font-medium text-green-600">+8% vs last week</div>
                </div>
                <div className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur">
                  <div className="text-xs uppercase tracking-wide text-secondary-500">Avg Time to Hire</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">21 days</div>
                  <div className="mt-1 text-xs font-medium text-red-500">+2 days vs target</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}