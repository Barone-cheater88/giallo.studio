import { sanityClient } from '@/sanity'
import { projectsIndexQuery, projectsQuery, siteSettingsQuery } from '@/lib/sanity.queries'
import styles from './projects/projects.module.css'
import ProjectsRow from './projects/ProjectsRow'
import MobileProjectsRow from './projects/MobileProjectsRow'
import ResponsiveTitle from '@/components/ResponsiveTitle'
import MobileTitle from '@/components/MobileTitle'
import MobileTitleFixed from '@/components/MobileTitleFixed'
import ProjectPreviewWrapper from '@/components/ProjectPreviewWrapper'

export async function generateMetadata() {
  const [settings, index] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(projectsIndexQuery)
  ])

  const fallbackTitle = 'Projects Index'
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
  const canonical = index?.seo?.canonicalUrl || (settings?.siteUrl ? `${settings.siteUrl.replace(/\/$/, '')}/` : undefined)

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

export default async function Home() {
  const [settings, index, projects] = await Promise.all([
    sanityClient.fetch(siteSettingsQuery),
    sanityClient.fetch(projectsIndexQuery),
    sanityClient.fetch(projectsQuery)
  ])
  return (
    <main className={styles.page}>
      {/* Componente per gestire l'anteprima dell'immagine al hover */}
      <ProjectPreviewWrapper projects={projects} />
      
      {/* ============================================
          VERSIONE DESKTOP (contenuto originale)
          ============================================ */}
      <div className={styles.desktopHome}>
        <div className={styles.container}>
          <div className={styles.content}>
            <ResponsiveTitle>
              GIALLO.STUDIO
            </ResponsiveTitle>

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
      </div>

      {/* ============================================
          VERSIONE MOBILE (nuovo layout)
          ============================================ */}
      <div className={styles.mobileHome}>
        {/* Titolo fixed che appare durante lo scroll (solo mobile) */}
        <MobileTitleFixed>
          GIALLO.STUDIO
        </MobileTitleFixed>
        
        <div className={styles.mobileHomeInner}>
          <MobileTitle>
            GIALLO.STUDIO
          </MobileTitle>

          {/* Tabella mobile con layout dedicato */}
          <div className={styles.mobileTable}>
            {projects.map((project, index) => (
              <MobileProjectsRow 
                key={project._id} 
                project={project} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
