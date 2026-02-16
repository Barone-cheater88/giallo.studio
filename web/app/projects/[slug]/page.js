import Image from 'next/image'
import { sanityClient } from '@/sanity'
import { projectBySlugQuery, projectsQuery } from '@/lib/sanity.queries'
import { notFound } from 'next/navigation'
import styles from './project.module.css'
import TypewriterText from './TypewriterText'
import ProjectNavigationWrapper from './ProjectNavigationWrapper'
import RevealOnScroll from './RevealOnScroll'
import { normalizeUrl } from '@/lib/utils'

export async function generateStaticParams() {
  const projects = await sanityClient.fetch(projectsQuery)
  if (!projects) return []
  return projects
    .map((project) => project?.slug?.current)
    .filter(Boolean)
    .map((slug) => ({ slug }))
}

export default async function ProjectPage({ params }) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams?.slug
  if (!slug) return <h1>Slug is missing</h1>

  const [project, allProjects] = await Promise.all([
    sanityClient.fetch(projectBySlugQuery(slug)),
    sanityClient.fetch(projectsQuery)
  ])
  
  if (!project) notFound()

  // Trova prev e next project basati sull'order
  const sortedProjects = allProjects.sort((a, b) => {
    if (a.order !== b.order) return (a.order || 0) - (b.order || 0)
    return new Date(a._createdAt) - new Date(b._createdAt)
  })
  
  const currentIndex = sortedProjects.findIndex(p => p._id === project._id)
  const prevProject = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null
  const nextProject = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null

  // Costruisci array di tutti i campi visibili (ordine: Name, Activity, Year, Client, Site, Font in use, Credits, Press)
  const allFields = []
  
  // Name - sempre visibile
  allFields.push({
    key: 'name',
    label: 'Name',
    content: project.title
  })
  
  // Activity
  if (project.info?.activity?.visible && project.info?.activity?.value) {
    allFields.push({
      key: 'activity',
      label: 'Activity',
      content: project.info.activity.value
    })
  }
  
  // Year
  if (project.info?.year?.visible && project.info?.year?.value) {
    allFields.push({
      key: 'year',
      label: 'Year',
      content: project.info.year.value
    })
  }
  
  // Client
  if (project.info?.client?.visible && project.info?.client?.value) {
    allFields.push({
      key: 'client',
      label: 'Client',
      content: project.info.client.value
    })
  }
  
  // Site
  if (project.info?.site?.visible && project.info?.site?.url) {
    allFields.push({
      key: 'site',
      label: 'Site',
      content: project.info.site.name || project.info.site.url,
      url: project.info.site.url
    })
  }
  
  // Font in Use
  if (project.info?.fontInUse?.visible && project.info?.fontInUse?.items && project.info.fontInUse.items.length > 0) {
    const visibleFonts = project.info.fontInUse.items.filter((item) => item.visible)
    if (visibleFonts.length > 0) {
      allFields.push({
        key: 'fontInUse',
        label: 'Font in use',
        fontItems: visibleFonts
      })
    }
  }
  
  // Credits
  if (project.info?.credits?.visible && project.info?.credits?.items && project.info.credits.items.length > 0) {
    const visibleCredits = project.info.credits.items.filter((item) => item.visible)
    if (visibleCredits.length > 0) {
      allFields.push({
        key: 'credits',
        label: 'Credits',
        creditItems: visibleCredits
      })
    }
  }
  
  // Press
  if (project.info?.press?.visible && project.info?.press?.items && project.info.press.items.length > 0) {
    const visiblePress = project.info.press.items.filter((item) => item.visible)
    if (visiblePress.length > 0) {
      allFields.push({
        key: 'press',
        label: 'Press',
        pressItems: visiblePress
      })
    }
  }

  return (
    <main className={styles.projectPage}>
      {/* Description */}
      {project.description && (
        <TypewriterText text={project.description} />
      )}

      {/* Sezione informazioni in griglia 2 colonne x 4 righe */}
      <div className={styles.infoGrid}>
        {allFields.map((field, index) => {
          const row = Math.floor(index / 2) + 1
          const col = (index % 2) + 1
          
          return (
            <div key={field.key} className={styles.infoCell} style={{ gridRow: row, gridColumn: col }}>
              {field.key === 'site' ? (
                <div className={styles.infoCellContent}>
                  <span className={styles.infoLabel}>{field.label}:</span>{' '}
                  <a
                    href={normalizeUrl(field.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.siteLink}
                  >
                    {field.content}
                  </a>
                </div>
              ) : field.key === 'fontInUse' ? (
                <div className={styles.infoCellContent}>
                  <span className={styles.infoLabel}>{field.label}:</span>{' '}
                  <span className={styles.infoSubItems}>
                    {field.fontItems.map((item, idx) => (
                      <span key={idx} className={styles.infoSubItem}>
                        {item.value}
                        {idx < field.fontItems.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </div>
              ) : field.key === 'credits' ? (
                <div className={styles.infoCellContent}>
                  <span className={styles.infoSubItems}>
                    {field.creditItems.map((item, idx) => (
                      <span key={idx} className={styles.infoSubItem}>
                        {item.role}: {item.names && item.names.length > 0 ? item.names.join(', ') : ''}
                        {idx < field.creditItems.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </div>
              ) : field.key === 'press' ? (
                <div className={styles.infoCellContent}>
                  <span className={styles.infoLabel}>{field.label}:</span>{' '}
                  <span className={styles.infoSubItems}>
                    {field.pressItems.map((item, idx) => (
                      <span key={idx} className={styles.infoSubItem}>
                        <a
                          href={normalizeUrl(item.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pressLink}
                        >
                          {item.title}
                        </a>
                        {idx < field.pressItems.length - 1 && <br />}
                      </span>
                    ))}
                  </span>
                </div>
              ) : (
                <div className={styles.infoCellContent}>
                  <span className={styles.infoLabel}>{field.label}:</span>{' '}
                  <span className={styles.infoValue}>{field.content}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Galleria media */}
      {project.mediaGalleries && project.mediaGalleries.length > 0 && (
        <div className={styles.gallerySection}>
          <ProjectNavigationWrapper prevProject={prevProject} nextProject={nextProject} />
          {project.mediaGalleries.map((gallery, galleryIndex) => (
            <div key={galleryIndex} className={styles.gallery}>
              {gallery.title && (
                <h2 className={styles.galleryTitle}>{gallery.title}</h2>
              )}
              <div
                className={`${styles.galleryGrid} ${
                  gallery.columnsDesktop === 1
                    ? styles.columns1
                    : gallery.columnsDesktop === 2
                    ? styles.columns2
                    : gallery.columnsDesktop === 3
                    ? styles.columns3
                    : gallery.columnsDesktop === 4
                    ? styles.columns4
                    : gallery.columnsDesktop === 5
                    ? styles.columns5
                    : gallery.columnsDesktop === 6
                    ? styles.columns6
                    : styles.columns1
                } ${
                  gallery.columnsMobile === 1
                    ? styles.mobileColumns1
                    : gallery.columnsMobile === 2
                    ? styles.mobileColumns2
                    : gallery.columnsMobile === 3
                    ? styles.mobileColumns3
                    : gallery.columnsMobile === 4
                    ? styles.mobileColumns4
                    : styles.mobileColumns1
                }`}
              >
                {gallery.items &&
                  gallery.items.map((item, itemIndex) => (
                    <RevealOnScroll key={itemIndex} className={styles.galleryItem}>
                      {item._type === 'galleryImage' && item.image?.asset?.url && (
                        <>
                          <img
                            src={item.image.asset.url}
                            alt={item.alt || item.caption || ''}
                            className={styles.galleryImage}
                          />
                          {item.caption && (
                            <div className={styles.galleryCaption}>{item.caption}</div>
                          )}
                        </>
                      )}
                      {item._type === 'galleryVideo' && item.video?.asset?.url && (
                        <>
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={item.poster?.asset?.url}
                            className={styles.galleryVideo}
                          >
                            <source src={item.video.asset.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          {item.caption && (
                            <div className={styles.galleryCaption}>{item.caption}</div>
                          )}
                        </>
                      )}
                    </RevealOnScroll>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
