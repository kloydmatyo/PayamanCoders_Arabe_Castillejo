'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Video,
  Award,
  Briefcase,
  TrendingUp,
  Calendar,
  Target,
  Users,
  FileText,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProfileCard from '@/components/ProfileCard'

interface Webinar {
  _id: string
  title: string
  scheduledDate: string
  category: string
  host: { name: string }
}

interface Stats {
  webinarsAttended: number
  assessmentsTaken: number
  certificatesEarned: number
  learningHours: number
}

export default function StudentHomepage() {
  const { user } = useAuth()
  const [upcomingWebinars, setUpcomingWebinars] = useState<Webinar[]>([])
  const [userProfile, setUserProfile] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    webinarsAttended: 0,
    assessmentsTaken: 0,
    certificatesEarned: 0,
    learningHours: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [profileRes, webinarsRes, certificatesRes] = await Promise.all([
        fetch('/api/user/profile', { credentials: 'include' }),
        fetch('/api/webinars?status=scheduled&limit=3'),
        fetch('/api/certificates/user')
      ])

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setUserProfile(profileData.user)
      }

      if (webinarsRes.ok) {
        const data = await webinarsRes.json()
        setUpcomingWebinars(data.webinars || [])
      }

      if (certificatesRes.ok) {
        const data = await certificatesRes.json()
        setStats(prev => ({
          ...prev,
          certificatesEarned: data.certificates?.length || 0
        }))
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

  if (loading) {
    return (
      <div className="hero-gradient relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="auth-background-grid" aria-hidden="true" />
        {isEntering && <div className="auth-entry-overlay" />}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl animate-pulse"></div>
          <div
            className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
        <div className="text-center relative z-10 animate-[floatUp_0.85s_ease-out]">
          <div className="futuristic-loader mx-auto mb-6">
            <div className="futuristic-loader-inner"></div>
          </div>
          <h2 className="auth-title text-2xl font-bold mb-3">
            Loading Dashboard...
          </h2>
          <p className="auth-subtitle">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h1 className="auth-title text-3xl font-bold animate-[floatUp_0.85s_ease-out]">
              Welcome, {user?.firstName || 'Student'}! 🎓
            </h1>
          </div>
          <p className="auth-subtitle">
            Your journey to career success starts here
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="stat-card"
            style={{ '--float-delay': '0.1s' } as CSSProperties}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/35 bg-purple-500/15 text-purple-500 shadow-inner shadow-purple-700/25">
                    <Video className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Webinars
                  </p>
                  <p className="stat-number">{stats.webinarsAttended}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card"
            style={{ '--float-delay': '0.2s' } as CSSProperties}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/35 bg-blue-500/15 text-blue-500 shadow-inner shadow-blue-700/25">
                    <FileText className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Assessments
                  </p>
                  <p className="stat-number">{stats.assessmentsTaken}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card"
            style={{ '--float-delay': '0.3s' } as CSSProperties}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/35 bg-green-500/15 text-green-500 shadow-inner shadow-green-700/25">
                    <Award className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Certificates
                  </p>
                  <p className="stat-number">{stats.certificatesEarned}</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="stat-card"
            style={{ '--float-delay': '0.4s' } as CSSProperties}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-500/35 bg-orange-500/15 text-orange-500 shadow-inner shadow-orange-700/25">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <p className="text-base font-medium uppercase tracking-wide text-secondary-600 leading-tight mb-1 break-words">
                    Learning Hours
                  </p>
                  <p className="stat-number">{stats.learningHours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="feature-heading text-xl font-semibold mb-6 animate-[floatUp_0.85s_ease-out]">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/webinars"
              className="feature-card p-6 group"
              style={{ '--float-delay': '0.1s' } as CSSProperties}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                Career Webinars
              </h3>
              <p className="text-sm text-secondary-600">Learn from experts</p>
            </Link>

            <Link
              href="/interview-prep"
              className="feature-card p-6 group"
              style={{ '--float-delay': '0.2s' } as CSSProperties}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                Interview Prep
              </h3>
              <p className="text-sm text-secondary-600">AI-powered tips</p>
            </Link>

            <Link
              href="/mentors"
              className="feature-card p-6 group"
              style={{ '--float-delay': '0.3s' } as CSSProperties}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                Find Mentors
              </h3>
              <p className="text-sm text-secondary-600">Get guidance</p>
            </Link>

            <Link
              href="/resume-builder"
              className="feature-card p-6 group"
              style={{ '--float-delay': '0.4s' } as CSSProperties}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                Resume Builder
              </h3>
              <p className="text-sm text-secondary-600">Create your resume</p>
            </Link>
          </div>
        </div>

        {/* Profile and Tips Section */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <ProfileCard userProfile={userProfile} />

          {/* Tips Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Student Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-secondary-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Complete skill assessments to earn certificates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Attend webinars to learn from industry experts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Build your resume early to stand out</span>
                </li>
              </ul>
            </div>

            <div className="card border-green-200/50 bg-gradient-to-br from-green-50/50 to-white">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Your Progress</h3>
              </div>
              <p className="mb-3 text-sm text-secondary-700">
                Keep learning and growing your skills to prepare for your career!
              </p>
              <div className="text-xs text-secondary-600">
                You're on the right track. Continue attending webinars and taking assessments.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Path */}
          <div className="card">
            <div className="flex items-center gap-2 mb-6 animate-[floatUp_0.85s_ease-out]">
              <Target className="h-5 w-5 text-purple-600" />
              <h2 className="feature-heading text-xl font-semibold">
                Your Learning Path
              </h2>
            </div>
            <div className="space-y-4">
              <div
                className="feature-card flex items-center gap-4 p-4"
                style={{ '--float-delay': '0.1s' } as CSSProperties}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Add your skills and experience
                  </p>
                </div>
                <Link href="/profile" className="btn-secondary px-4 py-2 text-sm">
                  Start
                </Link>
              </div>

              <div
                className="feature-card flex items-center gap-4 p-4"
                style={{ '--float-delay': '0.2s' } as CSSProperties}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Take Skill Assessments
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Test your knowledge and earn certificates
                  </p>
                </div>
                <Link href="/assessments" className="btn-secondary px-4 py-2 text-sm">
                  Start
                </Link>
              </div>

              <div
                className="feature-card flex items-center gap-4 p-4"
                style={{ '--float-delay': '0.3s' } as CSSProperties}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Attend Webinars
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Learn from industry professionals
                  </p>
                </div>
                <Link href="/webinars" className="btn-secondary px-4 py-2 text-sm">
                  Browse
                </Link>
              </div>

              <div
                className="feature-card flex items-center gap-4 p-4"
                style={{ '--float-delay': '0.4s' } as CSSProperties}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Apply for Internships
                  </h3>
                  <p className="text-sm text-secondary-600">
                    Gain real-world experience
                  </p>
                </div>
                <Link href="/jobs?type=internship" className="btn-secondary px-4 py-2 text-sm">
                  Search
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Webinars */}
          <div className="card">
            <div className="flex justify-between items-center mb-6 animate-[floatUp_0.85s_ease-out]">
              <h2 className="feature-heading text-xl font-semibold">
                Upcoming Webinars
              </h2>
              <Link href="/webinars" className="auth-link text-sm font-medium">
                View All
              </Link>
            </div>

            {upcomingWebinars.length === 0 ? (
              <div className="text-center py-12">
                <div className="feature-icon mx-auto mb-4 w-16 h-16">
                  <Video className="w-8 h-8 text-primary-500" />
                </div>
                <p className="auth-subtitle mb-6">No upcoming webinars</p>
                <Link
                  href="/webinars"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Browse Webinars
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingWebinars.map((webinar, index) => (
                  <Link
                    key={webinar._id}
                    href={`/webinars/${webinar._id}`}
                    className="feature-card p-5 group block"
                    style={
                      { '--float-delay': `${0.1 + index * 0.08}s` } as CSSProperties
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                        <Video className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                          {webinar.title}
                        </h3>
                        <p className="text-sm text-secondary-600 mb-2">
                          by {webinar.host.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-secondary-500">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(webinar.scheduledDate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
