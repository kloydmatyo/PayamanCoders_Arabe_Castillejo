'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Video, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProfileCard from '@/components/ProfileCard'

interface Webinar {
  _id: string
  title: string
  scheduledDate: string
  duration: number
  status: string
  attendees: any[]
  category: string
}

interface Stats {
  totalWebinars: number
  upcomingWebinars: number
  totalAttendees: number
  completedWebinars: number
}

export default function MentorHomepage() {
  const { user } = useAuth()
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    totalWebinars: 0,
    upcomingWebinars: 0,
    totalAttendees: 0,
    completedWebinars: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch profile data
      const profileRes = await fetch('/api/user/profile', { credentials: 'include' })
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setUserProfile(profileData.user)
      }
      
      // Fetch mentor's webinars
      const response = await fetch('/api/webinars?status=all')
      if (response.ok) {
        const data = await response.json()
        const allWebinars = data.webinars || []
        
        console.log('All webinars:', allWebinars)
        console.log('Current user:', user)
        console.log('User _id:', (user as any)?._id)
        console.log('User id:', (user as any)?.id)
        
        // Filter webinars hosted by this mentor
        // Convert both IDs to strings for comparison
        // The user object has _id, not userId
        const myWebinars = allWebinars.filter((w: any) => {
          const hostUserId = w.host?.userId?.toString()
          const currentUserId = ((user as any)?._id || (user as any)?.id)?.toString()
          console.log('Comparing:', { hostUserId, currentUserId, match: hostUserId === currentUserId })
          return hostUserId === currentUserId
        })
        
        console.log('My webinars:', myWebinars)
        setWebinars(myWebinars)
        
        // Calculate stats
        const upcoming = myWebinars.filter((w: Webinar) => w.status === 'scheduled').length
        const completed = myWebinars.filter((w: Webinar) => w.status === 'completed').length
        const totalAttendees = myWebinars.reduce((sum: number, w: Webinar) => sum + w.attendees.length, 0)
        
        setStats({
          totalWebinars: myWebinars.length,
          upcomingWebinars: upcoming,
          totalAttendees,
          completedWebinars: completed,
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden border-b border-white/30 bg-white/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-[-40%] h-56 w-56 rounded-full bg-primary-500/20 blur-3xl"></div>
          <div className="absolute left-[-20%] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-secondary-500/15 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Mentor'}! 🎓
          </h1>
          <p className="text-secondary-600">
            Manage your webinars, track your impact, and inspire the next generation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Webinars</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalWebinars}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Video className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Upcoming</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.upcomingWebinars}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Attendees</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">Completed</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.completedWebinars}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            href="/webinars/create"
            className="card group flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Create Webinar</h3>
              <p className="text-sm text-secondary-600">Schedule a new session</p>
            </div>
          </Link>

          <Link
            href="/webinars"
            className="card group flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Video className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">All Webinars</h3>
              <p className="text-sm text-secondary-600">View all sessions</p>
            </div>
          </Link>

          <Link
            href="/profile"
            className="card group flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Update Profile</h3>
              <p className="text-sm text-secondary-600">Manage your info</p>
            </div>
          </Link>
        </div>

        {/* Webinars List */}
        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Webinars</h2>
            <Link
              href="/webinars/create"
              className="btn-primary px-4 py-2 text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-white/50 p-4">
                  <div className="mb-2 h-6 w-3/4 rounded bg-white/70"></div>
                  <div className="h-4 w-1/2 rounded bg-white/70"></div>
                </div>
              ))}
            </div>
          ) : webinars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-primary-500/40 bg-white/40 py-12 text-center backdrop-blur">
              <Video className="mx-auto mb-4 h-12 w-12 text-secondary-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No webinars yet
              </h3>
              <p className="mb-4 text-secondary-600">
                Create your first webinar to start sharing your expertise
              </p>
              <Link
                href="/webinars/create"
                className="btn-primary px-6 py-2 text-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Webinar
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {webinars.slice(0, 5).map((webinar) => (
                <Link
                  key={webinar._id}
                  href={`/webinars/${webinar._id}`}
                  className="group flex items-center justify-between rounded-xl border border-white/40 bg-white/60 p-4 shadow-inner shadow-primary-900/5 backdrop-blur transition-all hover:border-primary-500/40 hover:shadow-lg"
                >
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                        {webinar.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                          webinar.status
                        )}`}
                      >
                        {webinar.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-secondary-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(webinar.scheduledDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {webinar.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {webinar.attendees.length} registered
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-secondary-400 transition-transform group-hover:translate-x-1 group-hover:text-primary-600" />
                </Link>
              ))}
              
              {webinars.length > 5 && (
                <Link
                  href="/webinars"
                  className="block text-center text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all {webinars.length} webinars →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Profile and Tips Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <ProfileCard userProfile={userProfile} />

          {/* Tips Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card border-blue-200/50 bg-blue-50/50">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">Mentor Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-secondary-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Create engaging webinar titles that clearly describe the topic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Add your Google Meet link before the webinar starts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>Engage with attendees through Q&A sessions</span>
              </li>
            </ul>
          </div>

            <div className="card border-green-200/50 bg-green-50/50">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Your Impact</h3>
              </div>
              <p className="mb-3 text-sm text-secondary-700">
                You've helped {stats.totalAttendees} job seekers through your webinars!
              </p>
              <div className="text-xs text-secondary-600">
                Keep up the great work. Your expertise is making a real difference in people's careers.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}