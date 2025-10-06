'use client'

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Activity,
  Calendar,
  Clock,
  Star,
  Target
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  pendingApplications: number
  usersByRole: {
    job_seeker: number
    employer: number
    mentor: number
    admin: number
  }
  recentActivity: Array<{
    id: string
    type: 'user_registration' | 'job_posted' | 'application_submitted'
    description: string
    timestamp: string
    userName?: string
  }>
}

interface AnalyticsProps {
  stats: AdminStats | null
}

export default function Analytics({ stats }: AnalyticsProps) {
  if (!stats) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">Platform statistics and insights</p>
        </div>
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4 text-white" />
      case 'job_posted':
        return <Briefcase className="h-4 w-4 text-white" />
      case 'application_submitted':
        return <FileText className="h-4 w-4 text-white" />
      default:
        return <Activity className="h-4 w-4 text-white" />
    }
  }

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'user_registration':
        return 'bg-blue-500'
      case 'job_posted':
        return 'bg-green-500'
      case 'application_submitted':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-sm text-gray-500">Platform statistics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">{stats.activeUsers}</span>
              <span className="text-gray-500"> active ({((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalJobs}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">{stats.activeJobs}</span>
              <span className="text-gray-500"> active ({((stats.activeJobs / stats.totalJobs) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalApplications}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-yellow-600 font-medium">{stats.pendingApplications}</span>
              <span className="text-gray-500"> pending</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalJobs > 0 ? ((stats.totalApplications / stats.totalJobs).toFixed(1)) : '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">applications per job</span>
            </div>
          </div>
        </div>
      </div>      {
/* User Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Distribution by Role</h3>
            <div className="space-y-4">
              {Object.entries(stats.usersByRole).map(([role, count]) => {
                const percentage = ((count / stats.totalUsers) * 100).toFixed(1)
                return (
                  <div key={role} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        role === 'job_seeker' ? 'bg-blue-500' :
                        role === 'employer' ? 'bg-green-500' :
                        role === 'mentor' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 font-medium">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Visual Bar Chart */}
            <div className="mt-6 space-y-2">
              {Object.entries(stats.usersByRole).map(([role, count]) => {
                const percentage = (count / stats.totalUsers) * 100
                return (
                  <div key={role} className="flex items-center">
                    <div className="w-20 text-xs text-gray-600 capitalize">
                      {role.replace('_', ' ')}
                    </div>
                    <div className="flex-1 mx-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            role === 'job_seeker' ? 'bg-blue-500' :
                            role === 'employer' ? 'bg-green-500' :
                            role === 'mentor' ? 'bg-purple-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-xs text-gray-600 text-right">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-800">User Engagement</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-green-800">
                    {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-600 ml-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-blue-800">Job Activity</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-blue-800">
                    {((stats.activeJobs / stats.totalJobs) * 100).toFixed(1)}%
                  </span>
                  <TrendingUp className="h-4 w-4 text-blue-600 ml-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-purple-800">Application Rate</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-purple-800">
                    {stats.totalJobs > 0 ? (stats.totalApplications / stats.totalJobs).toFixed(1) : '0'} per job
                  </span>
                  <Star className="h-4 w-4 text-purple-600 ml-1" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-yellow-800">Pending Reviews</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-bold text-yellow-800">
                    {stats.pendingApplications}
                  </span>
                  <Clock className="h-4 w-4 text-yellow-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Platform Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {stats.recentActivity.slice(0, 15).map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== Math.min(14, stats.recentActivity.length - 1) ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActivityTypeColor(activity.type)}`}>
                          {getActivityTypeIcon(activity.type)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          {activity.userName && (
                            <p className="text-xs text-gray-400 mt-1">by {activity.userName}</p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <time dateTime={activity.timestamp}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Platform Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-500">Total Users Registered</div>
              <div className="text-xs text-green-600 mt-1">
                {stats.activeUsers} active users ({((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%)
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalJobs}</div>
              <div className="text-sm text-gray-500">Jobs Posted</div>
              <div className="text-xs text-green-600 mt-1">
                {stats.activeJobs} currently active
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalApplications}</div>
              <div className="text-sm text-gray-500">Applications Submitted</div>
              <div className="text-xs text-yellow-600 mt-1">
                {stats.pendingApplications} pending review
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}