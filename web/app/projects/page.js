import { sanityClient } from '@/sanity'
import { projectsIndexQuery, projectsQuery, siteSettingsQuery } from '@/lib/sanity.queries'
import styles from './projects.module.css'
import ProjectsRow from './ProjectsRow'
import ResponsiveTitle from '@/components/ResponsiveTitle'

export async function generateMetadata() {
  const [settings, index] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(projectsIndexQuery)
  ])

  const fallbackTitle = 'Progetti'
  const title =
    index?.seo?.metaTitle ||
    index?.title ||
    fallbackTitle

  const description =
    index?.seo?.metaDescription ||
    index?.description ||
    settings?.seo?.metaDescription ||
    undefined

  const ogImageUrl = index?.seo?.ogImage?.asset?.url || settings?.seo?.ogImage?.asset?.url
  const canonical = index?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/projects` : undefined)

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

export default async function ProjectsPage() {
  const [settings, index, projects] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(projectsIndexQuery),
    sanityClient.fetch(projectsQuery)
  ])

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Titolo GIALLO.STUDIO - Desktop (fixed) */}
          <ResponsiveTitle>
            GIALLO.STUDIO
          </ResponsiveTitle>

          {/* Titolo Mobile - Visibile solo su mobile */}
          <h1 className={styles.titleMobileMobile}>
            GIALLO.STUDIO
          </h1>

          {/* Tabella */}
          <div className={styles.table}>
            <div className={`${styles.row} ${styles.header}`}>
              <div className={styles.cell}>
                <div className={styles.orderCell}>
                  <span className={styles.rowBullet} aria-hidden="true" />
                  <span>N°</span>
                </div>
              </div>
              <div className={styles.cell}>Name</div>
              <div className={styles.cell}>Category</div>
              <div className={styles.cell}>Client</div>
              <div className={styles.cell}>Description</div>
              <div className={`${styles.cell} ${styles.right}`}>Year</div>
            </div>

            {projects.map((project, index) => (
              <ProjectsRow 
                key={project._id} 
                project={project} 
                index={index}
                delay={index * 50}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
