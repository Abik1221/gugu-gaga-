import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mymesob.com'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/register', '/affiliate', '/terms', '/privacy'],
      disallow: ['/admin/', '/api/', '/_next/', '/dashboard/', '/.well-known/'],
      crawlDelay: 1,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}