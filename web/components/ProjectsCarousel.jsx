'use client'

import Link from 'next/link'
import styles from './ProjectsCarousel.module.css'

export default function ProjectsCarousel({ projects }) {
  // Mappa valori categorie ai loro titoli
  const categoryMap = {
    'art-direction': 'Art Direction',
    'brand-identity': 'Brand Identity',
    'editorial': 'Editorial',
    'graphic-design': 'Graphic Design',
    'product-design': 'Product Design',
    '3d-modeling': '3D Modeling',
    'web-design': 'Web Design',
    'development': 'Development',
    'type-design': 'Type Design'
  }

  // Formatta l'ordine del progetto
  const formatOrder = (order) => {
    if (order === null || order === undefined) return ''
    const orderNum = typeof order === 'number' ? order : parseInt(order, 10)
    return !isNaN(orderNum) && orderNum > 0 ? String(orderNum).padStart(3, '0') : ''
  }

  // Formatta le categorie
  const formatCategories = (categories) => {
    if (!Array.isArray(categories)) return ''
    return categories.map(cat => categoryMap[cat] || cat).join(' / ')
  }

  // Crea un array continuo di tutti i progetti
  const allProjects = projects || []
  
  // Se non ci sono progetti, restituisci array vuoto
  if (allProjects.length === 0) {
    return (
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselContainer}></div>
      </div>
    )
  }
  
  // Organizza tutti i progetti in righe da 3 progetti (come una griglia normale)
  const organizeInRows = (projectsList) => {
    const rows = []
    for (let i = 0; i < projectsList.length; i += 3) {
      const row = []
      for (let j = 0; j < 3 && (i + j) < projectsList.length; j++) {
        row.push(projectsList[i + j])
      }
      if (row.length > 0) {
        rows.push(row)
      }
    }
    return rows
  }

  // Organizza i progetti in righe
  const rows = organizeInRows(allProjects)

  // Funzione per renderizzare un singolo progetto
  const renderProject = (project, key) => {
    if (!project) {
      return null
    }

    const orderFormatted = formatOrder(project.order)
    const categories = formatCategories(project.categories)
    const yearValue = project.info?.year?.value
    const year = yearValue !== null && yearValue !== undefined ? String(yearValue) : ''
    const slug = project.slug?.current

    const ProjectContent = (
      <div className={styles.projectCard}>
        {orderFormatted && (
          <div className={styles.projectOrder}>
            [{orderFormatted}]
          </div>
        )}
        <div className={styles.projectContent}>
          <div className={styles.projectTitle}>
            {project.title}
            {year && (
              <sup className={styles.projectYear}>
                {year}
              </sup>
            )}
          </div>
          {categories && (
            <div className={styles.projectCategories}>
              {categories}
            </div>
          )}
        </div>
      </div>
    )

    return slug ? (
      <Link 
        key={key}
        href={`/projects/${slug}`}
        className={styles.projectLink}
      >
        {ProjectContent}
      </Link>
    ) : (
      <div key={key} className={styles.projectWrapper}>
        {ProjectContent}
      </div>
    )
  }

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselContainer}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.carouselRow}>
            {row.map((project, projectIndex) => (
              <div 
                key={`${project._id}-${rowIndex}-${projectIndex}`} 
                className={styles.projectItem}
              >
                {renderProject(project, `${project._id}-${rowIndex}-${projectIndex}`)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
