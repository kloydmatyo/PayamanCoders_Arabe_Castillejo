import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Resource Library',
  description: 'Curated career resources from mentors and experts. Access articles, videos, guides, templates, tools, and courses to advance your career.',
  keywords: ['career resources', 'professional development', 'career guides', 'resume templates', 'interview prep', 'career development', 'upskilling'],
  path: '/resources',
})
