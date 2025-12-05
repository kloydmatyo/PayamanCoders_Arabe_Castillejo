import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Browse Jobs & Internships',
  description: 'Discover internships and career opportunities aligned with your skills and growth goals. Search and filter through hundreds of job listings from top companies.',
  keywords: ['jobs', 'internships', 'career opportunities', 'job search', 'employment', 'hiring', 'remote jobs', 'full-time jobs', 'part-time jobs'],
  path: '/jobs',
})
