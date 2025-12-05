import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import { Metadata } from 'next'
import LayoutClient from '@/components/layout/LayoutClient'
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/StructuredData'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: {
    default: 'WorkQit - Connecting Talent with Opportunity',
    template: '%s | WorkQit'
  },
  description: 'A dual-purpose platform connecting individuals with job opportunities and upskilling resources. Find jobs, build your career, connect with mentors, and access professional development resources.',
  keywords: ['jobs', 'career', 'mentorship', 'upskilling', 'professional development', 'job search', 'talent', 'recruitment'],
  authors: [{ name: 'WorkQit' }],
  creator: 'WorkQit',
  publisher: 'WorkQit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'WorkQit - Connecting Talent with Opportunity',
    description: 'A dual-purpose platform connecting individuals with job opportunities and upskilling resources.',
    url: '/',
    siteName: 'WorkQit',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkQit - Connecting Talent with Opportunity',
    description: 'A dual-purpose platform connecting individuals with job opportunities and upskilling resources.',
    creator: '@workqit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="min-h-screen bg-transparent font-[family-name:var(--font-space-grotesk)]">
        <OrganizationStructuredData />
        <WebsiteStructuredData />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}
