import { sanityClient } from '@/sanity'
import { siteSettingsQuery } from '@/lib/sanity.queries'
import styles from './page.module.css'

export async function generateMetadata() {
  const settings = await sanityClient.fetch(siteSettingsQuery)
  
  const siteTitle = settings?.seo?.metaTitle || settings?.siteTitle || 'giallo.studio'
  const siteUrl = settings?.siteUrl || 'https://giallo.studio'

  return {
    title: `Archiviallo | ${siteTitle}`,
    description: 'Coming Soon',
    alternates: {
      canonical: `${siteUrl}/archiviallo`,
    },
  }
}

export default async function Archiviallo() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Coming Soon</h1>
      </div>
    </main>
  )
}
