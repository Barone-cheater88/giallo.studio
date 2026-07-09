import { sanityClient } from '@/sanity'
import { pageBySlugQuery, projectBySlugQuery, siteSettingsQuery } from '@/lib/sanity.queries'
import { redirect, notFound } from 'next/navigation'
import PageDescription from '@/components/PageDescription'
import styles from './page.module.css'

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

  // Se qualcuno visita /pages/home, rimandalo alla home pulita /
  if (pageSlug === 'home') {
    redirect('/')
  }

  const page = await sanityClient.fetch(pageBySlugQuery(pageSlug))

  // Se non esiste una pagina con questo slug, prova a vedere se esiste un progetto
  if (!page) {
    const project = await sanityClient.fetch(projectBySlugQuery(pageSlug))

    // Se esiste un progetto con questo slug, reindirizza alla nuova struttura /projects/:slug
    if (project) {
      redirect(`/projects/${pageSlug}`)
    }

    // Altrimenti 404 classico
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
