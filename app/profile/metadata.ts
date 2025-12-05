import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your WorkQit profile, update your information, and showcase your skills and experience.',
  robots: {
    index: false, // Don't index authenticated pages
    follow: false,
  },
}
