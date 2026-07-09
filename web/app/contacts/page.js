import { sanityClient } from '../../sanity.js'
import { siteSettingsQuery, pageBySlugQuery } from '../../lib/sanity.queries.js'
import styles from './page.module.css'
import PageDescription from '@/components/PageDescription'

export async function generateMetadata() {
  const [settings, contactsPage] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(pageBySlugQuery('contacts'))
  ])

  const title =
    contactsPage?.seo?.metaTitle ||
    contactsPage?.title ||
    settings?.seo?.metaTitle ||
    settings?.siteTitle ||
    'Contacts'

  const description =
    contactsPage?.seo?.metaDescription ||
    contactsPage?.descriptionText ||
    settings?.seo?.metaDescription ||
    settings?.siteClaim ||
    undefined

  const ogImageUrl = contactsPage?.seo?.ogImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const canonical = contactsPage?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/contacts` : undefined)
  const keywords = contactsPage?.seo?.keywords?.length ? contactsPage.seo.keywords : settings?.seo?.keywords

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

export default async function Contacts() {
  const contactsPage = await sanityClient.fetch(pageBySlugQuery('contacts'))

  return (
    <div className="contactsPage">
      {/* Descrizione con typo subtitle */}
      {contactsPage?.description && (
        <div
          className={styles.contactsContent}
        >
          <PageDescription value={contactsPage.description} indent={false} />
        </div>
      )}

    </div>
  )
}
