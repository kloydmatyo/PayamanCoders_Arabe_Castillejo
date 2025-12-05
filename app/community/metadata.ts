import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Community',
  description: 'Connect, share, and learn from professionals in your field. Join discussions, share experiences, and get advice from the WorkQit community.',
  keywords: ['professional community', 'career discussions', 'networking', 'career advice', 'professional networking', 'peer support'],
  path: '/community',
})
