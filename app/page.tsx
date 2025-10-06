'use client'

import Hero from '@/components/LandingPage/Hero'
import Features from '@/components/LandingPage/Features'
import Stats from '@/components/LandingPage/Stats'
import JobSeekerHomepage from '@/components/homepage/JobSeekerHomepage'
import EmployerHomepage from '@/components/homepage/EmployerHomepage'
import MentorHomepage from '@/components/homepage/MentorHomepage'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Show role-specific homepage for authenticated users
if (user) {
  switch (user.role) {
    case 'employer':
      return <EmployerHomepage />
    case 'mentor':
      return <MentorHomepage />
    case 'job_seeker':
      return <JobSeekerHomepage />
    case 'admin':
      // Redirect to /admin or render AdminHomepage if you have one
      if (typeof window !== 'undefined') {
        window.location.href = '/admin'
        return null
      }
      return null
    default:
      return <JobSeekerHomepage />
  }
}

  // Default homepage for unauthenticated users (general landing page)
  return (
    <div>
      <Hero />
      <Features />
      <Stats />
    </div>
  )
}