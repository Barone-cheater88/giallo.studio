import { sanityClient } from '../../sanity.js'
import { siteSettingsQuery, pageBySlugQuery } from '../../lib/sanity.queries.js'
import { GLYPH } from '@/lib/unicodeText'
import styles from './page.module.css'
import Footer from '@/components/Footer'
import { PortableText } from '@portabletext/react'

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
    contactsPage?.description ||
    settings?.seo?.metaDescription ||
    settings?.siteClaim ||
    undefined

  const ogImageUrl = contactsPage?.seo?.ogImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const canonical = contactsPage?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/contacts` : undefined)

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

export default async function Contacts() {
  const [contactsPage, settings] = await Promise.all([
    sanityClient.fetch(pageBySlugQuery('contacts')),
    sanityClient.fetch(siteSettingsQuery)
  ])

  const contactInfo = settings?.contactInfo || {}
  const social = settings?.social || {}
  const legal = settings?.legal || {}

  // Carica l'SVG del logo per il footer
  let logoSvgContent = null
  const logoSvgUrl = settings?.logoSvg?.asset?.url
  if (logoSvgUrl && typeof logoSvgUrl === 'string' && (logoSvgUrl.startsWith('http') || logoSvgUrl.startsWith('https'))) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const svgResponse = await fetch(logoSvgUrl, {
        cache: 'no-store',
        signal: controller.signal
      }).catch(() => null)
      
      clearTimeout(timeoutId)
      
      if (svgResponse && svgResponse.ok) {
        const svgText = await svgResponse.text()
        logoSvgContent = svgText
          .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
          .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"')
          .replace(/fill='(?!none)[^']*'/g, "fill='currentColor'")
          .replace(/stroke='(?!none)[^']*'/g, "stroke='currentColor'")
          .replace(
            /<svg([^>]*)>/,
            '<svg$1 style="max-width: 80px; max-height: 80px; width: auto; height: auto; color: inherit; fill: currentColor;">'
          )
      }
    } catch (error) {
      // Gestisci silenziosamente l'errore
    }
  }

  return (
    <div className="contactsPage">
      {/* Descrizione con typo subtitle */}
      {contactsPage?.description && (
        <div
          className={styles.contactsContent}
        >
          {contactsPage.description.split('\n').map((paragraph, index) => (
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
                marginBottom: index < contactsPage.description.split('\n').length - 1 ? '1em' : 0,
                textIndent: '80px'
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {/* Informazioni di contatto */}
      <section className={styles.contactsSection}>
        {/* Elenco contatti in una colonna - solo le voci richieste nell'ordine specificato */}
        {contactInfo.email && (
          <div className={styles.contactItem}>
            <a href={`mailto:${contactInfo.email}`}>
              –– {contactInfo.email}
            </a>
          </div>
        )}

        {(contactInfo.instagram || social.instagram) && (
          <div className={styles.contactItem}>
            <a
              href={contactInfo.instagram || social.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              –– Instagram {GLYPH.arrowNE}
            </a>
          </div>
        )}

        {(contactInfo.linkedin || social.linkedin) && (
          <div className={styles.contactItem}>
            <a
              href={contactInfo.linkedin || social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              –– Linkedin {GLYPH.arrowNE}
            </a>
          </div>
        )}

        {contactInfo.address && (
          <div className={styles.contactItem}>
            –– {contactInfo.address}
          </div>
        )}

        {contactInfo.piva && (
          <div className={styles.contactItem}>
            –– P.Iva: {contactInfo.piva}
          </div>
        )}
      </section>
    </div>
  )
}
