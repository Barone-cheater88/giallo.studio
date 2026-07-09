import { sanityClient } from '../../sanity.js'
import { siteSettingsQuery, pageBySlugQuery } from '../../lib/sanity.queries.js'
import styles from './page.module.css'
import ClientsGrid from './ClientsGrid'
import PageDescription from '@/components/PageDescription'

export async function generateMetadata() {
  const [settings, aboutPage] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(pageBySlugQuery('about'))
  ])

  const title =
    aboutPage?.seo?.metaTitle ||
    aboutPage?.title ||
    settings?.seo?.metaTitle ||
    settings?.siteTitle ||
    'About'

  const description =
    aboutPage?.seo?.metaDescription ||
    aboutPage?.descriptionText ||
    settings?.seo?.metaDescription ||
    settings?.siteClaim ||
    undefined

  const ogImageUrl = aboutPage?.seo?.ogImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const canonical = aboutPage?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/about` : undefined)
  const keywords = aboutPage?.seo?.keywords?.length ? aboutPage.seo.keywords : settings?.seo?.keywords

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

export default async function About() {
  const [aboutPage, settings] = await Promise.all([
    sanityClient.fetch(pageBySlugQuery('about')),
    sanityClient.fetch(siteSettingsQuery)
  ])

  const competencies = settings?.competencies || []
  const selectedClients = settings?.selectedClients || []

  return (
    <>
      {/* Descrizione con typo subtitle */}
      {aboutPage?.description && (
        <div
          className={styles.aboutContent}
        >
          <PageDescription value={aboutPage.description} />
        </div>
      )}

      {/* Sezione Competenze a 4 colonne */}
      {competencies.length > 0 && (
        <section
          className={styles.competenciesSection}
        >
          {competencies.map((competency, index) => (
            <div 
              key={index}
            >
              {competency.main && (
                <h3
                  style={{
                    margin: 0,
                    marginBottom: '1rem'
                  }}
                >
                  {competency.main}:
                </h3>
              )}
              {competency.items && competency.items.length > 0 && (
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}
                >
                  {competency.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      style={{
                        margin: 0,
                        padding: 0
                      }}
                    >
                      – {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Sezione Selected Clients */}
      {selectedClients.length > 0 && (
        <section
          className={styles.clientsSection}
        >
          <div style={{ marginBottom: '1em' }}>Selected Clients:</div>
          <style dangerouslySetInnerHTML={{__html: `
            .selected-clients-link {
              text-decoration: none;
            }
            .selected-clients-link:hover {
              text-decoration: underline !important;
              text-decoration-thickness: 1px !important;
              -webkit-text-decoration-thickness: 1px !important;
              text-underline-offset: 2px;
            }
          `}} />
          <ClientsGrid clients={selectedClients} />
        </section>
      )}
    </>
  )
}

