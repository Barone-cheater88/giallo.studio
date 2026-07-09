import { sanityClient } from '@/sanity'
import { archivialloQuery, siteSettingsQuery } from '@/lib/sanity.queries'
import styles from './page.module.css'

export async function generateMetadata() {
  const [settings, page] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(archivialloQuery)
  ])
  
  const siteTitle = settings?.seo?.metaTitle || settings?.siteTitle || 'giallo.studio'
  const title = page?.seo?.metaTitle || page?.title || 'giallo.archive'
  const description =
    page?.seo?.metaDescription ||
    page?.description ||
    settings?.seo?.metaDescription ||
    'Coming Soon'
  const canonical = page?.seo?.canonicalUrl || 'https://giallo.studio/giallo-archive'
  const ogImageUrl = page?.seo?.ogImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const keywords = page?.seo?.keywords?.length ? page.seo.keywords : settings?.seo?.keywords

  return {
    title: page?.seo?.metaTitle ? title : `${title} | ${siteTitle}`,
    description,
    keywords,
    alternates: { canonical },
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

export default async function GialloArchive() {
  const page = await sanityClient.fetch(archivialloQuery)
  const title = page?.title || 'Coming Soon'

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{title}</h1>
        {page?.description && (
          <p className={styles.description}>{page.description}</p>
        )}
      </div>
    </main>
  )
}
