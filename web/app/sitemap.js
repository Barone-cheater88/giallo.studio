import { sanityClient } from '@/sanity'
import { siteSettingsQuery, pagesQuery, projectsQuery } from '@/lib/sanity.queries'

export default async function sitemap() {
  const baseUrl = 'https://giallo.studio'
  
  // Fetch data from Sanity
  const [settings, pages, projects] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(pagesQuery),
    sanityClient.fetch(projectsQuery),
  ])

  const siteUrl = settings?.siteUrl || baseUrl
  const cleanSiteUrl = siteUrl.replace(/\/$/, '')

  // Homepage
  const routes = [
    {
      url: cleanSiteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${cleanSiteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${cleanSiteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${cleanSiteUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Add pages
  const pageRoutes = pages
    .filter(page => page?.slug?.current)
    .map(page => ({
      url: `${cleanSiteUrl}/${page.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

  // Add projects
  const projectRoutes = projects
    .filter(project => project?.slug?.current)
    .map(project => ({
      url: `${cleanSiteUrl}/projects/${project.slug.current}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [...routes, ...pageRoutes, ...projectRoutes]
}
