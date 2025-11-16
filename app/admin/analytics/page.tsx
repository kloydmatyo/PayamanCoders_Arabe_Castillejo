'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Award
} from 'lucide-react'

interface AnalyticsData {
  users: {
    total: number
    jobSeekers: number
    employers: number
    mentors: number
    students: number
    newThisMonth: number
  }
  jobs: {
    total: number
    active: number
    filled: number
    applications: number
  }
  assessments: {
    total: number
    attempts: number
    averageScore: number
    passRate: number
  }
  mentorship: {
    totalRequests: number
    accepted: number
    pending: number
    rejected: number
  }
  verification: {
    pending: number
    verified: number
    rejected: number
  }
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const result = await response.json()
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary-600" />
            Platform Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive overview of platform metrics and performance
          </p>
        </div>

        {/* User Statistics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={data.users.total}
              icon={<Users className="h-6 w-6" />}
              color="blue"
              subtitle={`+${data.users.newThisMonth} this month`}
            />
            <StatCard
              title="Job Seekers"
              value={data.users.jobSeekers}
              icon={<Briefcase className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Employers"
              value={data.users.employers}
              icon={<Briefcase className="h-6 w-6" />}
              color="purple"
            />
            <StatCard
              title="Mentors"
              value={data.users.mentors}
              icon={<GraduationCap className="h-6 w-6" />}
              color="orange"
            />
          </div>
        </div>

        {/* Jobs & Applications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Jobs & Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Jobs"
              value={data.jobs.total}
              icon={<Briefcase className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Active Jobs"
              value={data.jobs.active}
              icon={<TrendingUp className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Filled Positions"
              value={data.jobs.filled}
              icon={<CheckCircle className="h-6 w-6" />}
              color="purple"
            />
            <StatCard
              title="Total Applications"
              value={data.jobs.applications}
              icon={<FileText className="h-6 w-6" />}
              color="orange"
            />
          </div>
        </div>

        {/* Assessments */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Assessments"
              value={data.assessments.total}
              icon={<FileText className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Attempts"
              value={data.assessments.attempts}
              icon={<Activity className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Average Score"
              value={`${data.assessments.averageScore}%`}
              icon={<Award className="h-6 w-6" />}
              color="purple"
            />
            <StatCard
              title="Pass Rate"
              value={`${data.assessments.passRate}%`}
              icon={<CheckCircle className="h-6 w-6" />}
              color="orange"
            />
          </div>
        </div>

        {/* Mentorship */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mentorship</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Requests"
              value={data.mentorship.totalRequests}
              icon={<GraduationCap className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Accepted"
              value={data.mentorship.accepted}
              icon={<CheckCircle className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Pending"
              value={data.mentorship.pending}
              icon={<Clock className="h-6 w-6" />}
              color="yellow"
            />
            <StatCard
              title="Rejected"
              value={data.mentorship.rejected}
              icon={<XCircle className="h-6 w-6" />}
              color="red"
            />
          </div>
        </div>

        {/* Verification */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verification Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Pending Verification"
              value={data.verification.pending}
              icon={<Clock className="h-6 w-6" />}
              color="yellow"
            />
            <StatCard
              title="Verified"
              value={data.verification.verified}
              icon={<CheckCircle className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Rejected"
              value={data.verification.rejected}
              icon={<XCircle className="h-6 w-6" />}
              color="red"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red'
  subtitle?: string
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  )
}
