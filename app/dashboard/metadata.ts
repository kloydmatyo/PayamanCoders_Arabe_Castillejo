import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your personalized WorkQit dashboard. Track your job applications, view recommendations, and manage your career journey.',
  robots: {
    index: false, // Don't index authenticated pages
    follow: false,
  },
}
