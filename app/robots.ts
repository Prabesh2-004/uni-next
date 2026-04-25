import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/profile/',
    },
    sitemap: 'https://prabeshlamichhane2004.com.np/sitemap.xml',
  }
}