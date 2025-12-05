import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Find Your Mentor',
  description: 'Connect with experienced professionals who can guide your career journey. Browse mentors by skills, expertise, and industry to find the perfect match for your career goals.',
  keywords: ['mentorship', 'career mentors', 'professional guidance', 'career coaching', 'networking', 'career development', 'expert advice'],
  path: '/mentors',
})
