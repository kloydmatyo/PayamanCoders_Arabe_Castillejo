import { Metadata } from 'next'

export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '',
  image,
}: {
  title: string
  description: string
  keywords?: string[]
  path?: string
  image?: string
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}${path}`
  const defaultImage = `${baseUrl}/og-image.png`

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: 'WorkQit',
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image || defaultImage],
      creator: '@workqit',
    },
    alternates: {
      canonical: url,
    },
  }
}
