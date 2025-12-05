import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Skill Assessments',
  description: 'Test your skills and earn certificates to boost your employability. Take technical, soft skills, and industry-specific assessments to validate your expertise.',
  keywords: ['skill assessments', 'certifications', 'skill tests', 'professional development', 'career assessment', 'technical skills', 'soft skills'],
  path: '/assessments',
})
