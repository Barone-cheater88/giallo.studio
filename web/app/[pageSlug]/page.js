import { sanityClient } from '@/sanity'
import { pageBySlugQuery, pagesQuery, siteSettingsQuery } from '@/lib/sanity.queries'
import { notFound } from 'next/navigation'
import PageDescription from '@/components/PageDescription'
import styles from './page.module.css'

export async function generateStaticParams() {
  const pages = await sanityClient.fetch(pagesQuery)
  if (!pages) {
    throw new Error('Impossibile leggere le pagine da Sanity durante la build')
  }
  const reserved = new Set(['home', 'about', 'contacts', 'projects', 'giallo-archive', 'archiviallo'])
  return pages
    .map((page) => page?.slug?.current)
    .filter((slug) => slug && !reserved.has(slug))
    .map((pageSlug) => ({ pageSlug }))
}

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params)
  const { pageSlug } = resolvedParams || {}
  if (!pageSlug || pageSlug === 'home') return {}

  const [page, settings] = await Promise.all([
    sanityClient.fetch(pageBySlugQuery(pageSlug)),
    sanityClient.fetch(siteSettingsQuery)
  ])

  if (!page) return {}

  const title =
    page?.seo?.metaTitle ||
    page?.title ||
    settings?.seo?.metaTitle ||
    settings?.siteTitle

  const description =
    page?.seo?.metaDescription ||
    page?.descriptionText ||
    settings?.seo?.metaDescription ||
    settings?.siteClaim ||
    undefined

  const keywords = page?.seo?.keywords?.length ? page.seo.keywords : settings?.seo?.keywords
  const ogImageUrl = page?.seo?.ogImage?.asset?.url || page?.coverImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const canonical = page?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/${pageSlug}` : undefined)

  return {
    title,
    description,
    keywords,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : []
    }
  }
}

export default async function Page({ params }) {
  // Next 16 può passare `params` come Promise (server components).
  const resolvedParams = await Promise.resolve(params)
  const { pageSlug } = resolvedParams || {}

  const page = await sanityClient.fetch(pageBySlugQuery(pageSlug))

  if (!page) {
    notFound()
  }

  const isLegalPage = ['cookies', 'privacy-policy'].includes(pageSlug)

  return (
    <main className={isLegalPage ? styles.legalPage : styles.page}>
      <h1>{page.title}</h1>
      {page.description && (
        <PageDescription
          value={page.description}
          indent={!isLegalPage}
          variant={isLegalPage ? 'body' : 'subtitle'}
        />
      )}
    </main>
  )
}
