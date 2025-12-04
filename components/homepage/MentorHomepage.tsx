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
  ArrowRight,
  GraduationCap,
  Briefcase
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProfileCard from '@/components/ProfileCard'
import TabNavigation from '@/components/TabNavigation'
import MentorScoreCard from '@/components/MentorScoreCard'

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
  pendingRequests?: number
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
        
        // Fetch mentorship requests count
        let pendingRequests = 0
        try {
          const requestsRes = await fetch('/api/mentorship/request?type=received')
          if (requestsRes.ok) {
            const requestsData = await requestsRes.json()
            pendingRequests = (requestsData.requests || []).filter((r: any) => r.status === 'pending').length
          }
        } catch (err) {
          console.error('Error fetching mentorship requests:', err)
        }
        
        setStats({
          totalWebinars: myWebinars.length,
          upcomingWebinars: upcoming,
          totalAttendees,
          completedWebinars: completed,
          pendingRequests,
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
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl animate-pulse"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute left-[-10%] bottom-20 h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-blue-400/15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden border-b border-white/30 bg-white/60 backdrop-blur-xl">
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden group/header mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover/header:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              <div className="relative flex items-center gap-4">
                <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-purple-500/40 group/icon flex-shrink-0">
                  <GraduationCap className="h-8 w-8 md:h-10 md:w-10 relative z-10 group-hover/icon:scale-110 group-hover/icon:rotate-12 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/50 to-blue-400/50 rounded-2xl blur-lg opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-2xl blur-xl opacity-0 group-hover/icon:opacity-100 animate-pulse transition-opacity duration-300"></div>
                </div>
                <div>
                  <h1 className="mb-2 text-4xl md:text-5xl font-bold text-gray-900">
                    Welcome back, {user?.firstName || 'Mentor'}! 🎓
                  </h1>
                  <p className="text-lg md:text-xl text-secondary-600">
                    Manage your webinars, track your impact, and inspire the next generation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Tab Navigation */}
        <TabNavigation
          tabs={[
            { id: 'overview', label: 'Overview', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'webinars', label: 'My Webinars', icon: <Video className="w-4 h-4" /> },
            { id: 'mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
          ]}
          defaultTab="overview"
        >
          {(activeTab) => (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-10">
                  {/* Mentor Score Card */}
                  <div className="animate-[floatUp_0.85s_ease-out_0.1s_both]">
                    <MentorScoreCard />
                  </div>

                  {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center justify-between p-8">
              <div>
                <p className="text-base font-bold text-secondary-600">Total Webinars</p>
                <p className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">{stats.totalWebinars}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all duration-300">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center justify-between p-8">
              <div>
                <p className="text-base font-bold text-secondary-600">Upcoming</p>
                <p className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">{stats.upcomingWebinars}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all duration-300">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center justify-between p-8">
              <div>
                <p className="text-base font-bold text-secondary-600">Total Attendees</p>
                <p className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">{stats.totalAttendees}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all duration-300">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card relative overflow-hidden group/stat hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15),transparent_70%)] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center justify-between p-8">
              <div>
                <p className="text-base font-bold text-secondary-600">Completed</p>
                <p className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">{stats.completedWebinars}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 group-hover/stat:scale-110 group-hover/stat:rotate-12 transition-all duration-300">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/webinars/create"
            className="card relative overflow-hidden group/action hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-primary-500/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover/action:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center gap-5 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/20 border border-primary-500/30 group-hover/action:scale-110 group-hover/action:rotate-12 transition-all duration-300">
                <Plus className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Create Webinar</h3>
                <p className="text-base text-secondary-600">Schedule a new session</p>
              </div>
            </div>
          </Link>

          <Link
            href="/webinars"
            className="card relative overflow-hidden group/action hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover/action:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center gap-5 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 group-hover/action:scale-110 group-hover/action:rotate-12 transition-all duration-300">
                <Video className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">All Webinars</h3>
                <p className="text-base text-secondary-600">View all sessions</p>
              </div>
            </div>
          </Link>

          <Link
            href="/mentorship/requests"
            className="card relative overflow-hidden group/action hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15),transparent_70%)] opacity-0 group-hover/action:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center gap-5 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 group-hover/action:scale-110 group-hover/action:rotate-12 transition-all duration-300">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">Mentorship Requests</h3>
                <p className="text-base text-secondary-600">View requests</p>
              </div>
              {stats.pendingRequests && stats.pendingRequests > 0 && (
                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-sm font-bold text-white shadow-xl ring-2 ring-white group-hover/action:scale-110 transition-transform">
                  {stats.pendingRequests}
                </div>
              )}
            </div>
          </Link>

          <Link
            href="/profile"
            className="card relative overflow-hidden group/action hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.15),transparent_70%)] opacity-0 group-hover/action:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center gap-5 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 group-hover/action:scale-110 group-hover/action:rotate-12 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Update Profile</h3>
                <p className="text-base text-secondary-600">Manage your info</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Webinars List */}
        <div className="card relative overflow-hidden group/webinars hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/webinars:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Webinars</h2>
              <Link
                href="/webinars/create"
                className="relative flex items-center justify-center gap-2 px-6 py-3 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <Plus className="h-5 w-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">Create New</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
              </Link>
            </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-white/50 p-6">
                  <div className="mb-3 h-7 w-3/4 rounded bg-white/70"></div>
                  <div className="h-5 w-1/2 rounded bg-white/70"></div>
                </div>
              ))}
            </div>
          ) : webinars.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-primary-500/40 bg-white/40 py-16 text-center backdrop-blur">
              <div className="feature-icon mx-auto mb-6 w-20 h-20">
                <Video className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                No webinars yet
              </h3>
              <p className="mb-6 text-lg text-secondary-600">
                Create your first webinar to start sharing your expertise
              </p>
              <Link
                href="/webinars/create"
                className="relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                <Plus className="h-5 w-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">Create Webinar</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {webinars.slice(0, 5).map((webinar) => (
                <Link
                  key={webinar._id}
                  href={`/webinars/${webinar._id}`}
                  className="group relative flex items-center justify-between rounded-2xl border-2 border-white/40 bg-white/60 p-6 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-500 hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-1 hover:scale-[1.01] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {webinar.title}
                      </h3>
                      <span
                        className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold shadow-md ${getStatusColor(
                          webinar.status
                        )}`}
                      >
                        {webinar.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-base text-secondary-600">
                      <span className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-semibold">{formatDate(webinar.scheduledDate)}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                          <Clock className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-semibold">{webinar.duration} min</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-semibold">{webinar.attendees.length} registered</span>
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-secondary-400 transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary-600 group-hover:scale-110 relative z-10" />
                </Link>
              ))}
              
              {webinars.length > 5 && (
                <Link
                  href="/webinars"
                  className="block text-center text-lg font-bold text-primary-600 hover:text-primary-500 transition-colors"
                >
                  View all {webinars.length} webinars →
                </Link>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Profile and Tips Section */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <ProfileCard userProfile={userProfile} />

          {/* Tips Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card relative overflow-hidden group/tips hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 border-2 border-blue-200/50 bg-blue-50/50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-500/10 opacity-0 group-hover/tips:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 group-hover/tips:scale-110 group-hover/tips:rotate-12 transition-all duration-300">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Mentor Tips</h3>
                </div>
                <ul className="space-y-3 text-base text-secondary-700">
                  <li className="flex items-start gap-3">
                    <span className="text-xl font-bold text-blue-600">•</span>
                    <span className="font-semibold">Create engaging webinar titles that clearly describe the topic</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl font-bold text-blue-600">•</span>
                    <span className="font-semibold">Add your Google Meet link before the webinar starts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-xl font-bold text-blue-600">•</span>
                    <span className="font-semibold">Engage with attendees through Q&A sessions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card relative overflow-hidden group/impact hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 border-2 border-green-200/50 bg-green-50/50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 opacity-0 group-hover/impact:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 group-hover/impact:scale-110 group-hover/impact:rotate-12 transition-all duration-300">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Impact</h3>
                </div>
                <p className="mb-4 text-lg font-bold text-secondary-700">
                  You've helped {stats.totalAttendees} job seekers through your webinars!
                </p>
                <div className="text-base text-secondary-600 font-medium">
                  Keep up the great work. Your expertise is making a real difference in people's careers.
                </div>
              </div>
            </div>
          </div>
        </div>
                </div>
              )}

              {activeTab === 'webinars' && (
                <div className="card relative overflow-hidden group/webinars hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500 mb-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/webinars:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-8">
                    <div className="mb-8 flex items-center justify-between">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Webinars</h2>
                      <Link
                        href="/webinars/create"
                        className="relative flex items-center justify-center gap-2 px-6 py-3 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                        <Plus className="h-5 w-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
                        <span className="relative z-10">Create New</span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                      </Link>
                    </div>

                    {loading ? (
                      <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse rounded-xl bg-white/50 p-6">
                            <div className="mb-3 h-7 w-3/4 rounded bg-white/70"></div>
                            <div className="h-5 w-1/2 rounded bg-white/70"></div>
                          </div>
                        ))}
                      </div>
                    ) : webinars.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-primary-500/40 bg-white/40 py-16 text-center backdrop-blur">
                        <div className="feature-icon mx-auto mb-6 w-20 h-20">
                          <Video className="w-12 h-12 text-primary-500" />
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-gray-900">
                          No webinars yet
                        </h3>
                        <p className="mb-6 text-lg text-secondary-600">
                          Create your first webinar to start sharing your expertise
                        </p>
                        <Link
                          href="/webinars/create"
                          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl border-2 border-primary-500/50 bg-white/60 backdrop-blur-xl text-primary-600 shadow-xl shadow-primary-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/50 hover:border-primary-500/70 hover:bg-white/80 overflow-hidden group/btn"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                          <Plus className="h-5 w-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
                          <span className="relative z-10">Create Webinar</span>
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-1000"></div>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {webinars.map((webinar) => (
                          <Link
                            key={webinar._id}
                            href={`/webinars/${webinar._id}`}
                            className="group relative flex items-center justify-between rounded-2xl border-2 border-white/40 bg-white/60 p-6 shadow-inner shadow-primary-900/5 backdrop-blur transition-all duration-500 hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-1 hover:scale-[1.01] overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex-1">
                              <div className="mb-3 flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  {webinar.title}
                                </h3>
                                <span
                                  className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold shadow-md ${getStatusColor(
                                    webinar.status
                                  )}`}
                                >
                                  {webinar.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-6 text-base text-secondary-600">
                                <span className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                                    <Calendar className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <span className="font-semibold">{formatDate(webinar.scheduledDate)}</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span className="font-semibold">{webinar.duration} min</span>
                                </span>
                                <span className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                                    <Users className="h-4 w-4 text-green-600" />
                                  </div>
                                  <span className="font-semibold">{webinar.attendees.length} registered</span>
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-6 w-6 text-secondary-400 transition-all duration-300 group-hover:translate-x-2 group-hover:text-primary-600 group-hover:scale-110 relative z-10" />
                          </Link>
                        ))}
                        
                        {webinars.length > 5 && (
                          <Link
                            href="/webinars"
                            className="block text-center text-lg font-bold text-primary-600 hover:text-primary-500 transition-colors"
                          >
                            View all {webinars.length} webinars →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'mentorship' && (
                <div className="card relative overflow-hidden group/mentorship hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5 opacity-0 group-hover/mentorship:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative p-8">
                    <div className="mb-8 flex items-center justify-between">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Mentorship Requests</h2>
                      <Link
                        href="/mentorship/requests"
                        className="auth-link text-base font-bold"
                      >
                        View All
                      </Link>
                    </div>

                    <div className="text-center py-16">
                      <div className="feature-icon mx-auto mb-6 w-20 h-20">
                        <Users className="w-12 h-12 text-primary-500" />
                      </div>
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">
                        {stats.pendingRequests && stats.pendingRequests > 0 
                          ? `${stats.pendingRequests} Pending Request${stats.pendingRequests !== 1 ? 's' : ''}`
                          : 'No Pending Requests'}
                      </h3>
                      <p className="mb-6 text-lg text-secondary-600">
                        {stats.pendingRequests && stats.pendingRequests > 0
                          ? 'Review and respond to mentorship requests from job seekers'
                          : 'You have no pending mentorship requests at the moment'}
                      </p>
                      <Link
                        href="/mentorship/requests"
                        className="btn-primary inline-flex items-center gap-3 px-8 py-4 text-base font-bold"
                      >
                        View Requests
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </TabNavigation>
        </div>
      </div>
    </div>
  )
}