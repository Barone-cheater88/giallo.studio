import { sanityClient } from '../../sanity.js'
import { siteSettingsQuery, pageBySlugQuery } from '../../lib/sanity.queries.js'
import styles from './page.module.css'
import ClientsGrid from './ClientsGrid'

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
    aboutPage?.description ||
    settings?.seo?.metaDescription ||
    settings?.siteClaim ||
    undefined

  const ogImageUrl = aboutPage?.seo?.ogImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const canonical = aboutPage?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/about` : undefined)

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined
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
          {aboutPage.description.split('\n').map((paragraph, index) => (
            <p
              key={index}
              style={{
                fontFamily: 'var(--font-subtitle)',
                fontWeight: 'var(--font-subtitle-weight)',
                fontStyle: 'var(--font-subtitle-style)',
                textTransform: 'var(--font-subtitle-transform)',
                lineHeight: 'var(--font-subtitle-line-height)',
                fontSize: 'clamp(var(--font-subtitle-size-mobile, 16px), 4vw, var(--font-subtitle-size-desktop, 20px))',
                color: 'inherit',
                margin: 0,
                marginBottom: index < aboutPage.description.split('\n').length - 1 ? '1em' : 0,
                textIndent: '80px'
              }}
            >
              {paragraph}
            </p>
          ))}
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
                      —— {item}
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

