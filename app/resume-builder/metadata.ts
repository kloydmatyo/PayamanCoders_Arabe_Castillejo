import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Resume Builder',
  description: 'Create a professional resume with our easy-to-use resume builder. Choose from multiple templates and formats to showcase your skills and experience.',
  keywords: ['resume builder', 'CV creator', 'professional resume', 'resume templates', 'job application', 'career tools'],
  path: '/resume-builder',
})
