'use client'

import { useEffect, useState } from 'react'
import ProjectsRow from './ProjectsRow'
import styles from './projects.module.css'

export default function ProjectsTable({ projects }) {
  const [allLoaded, setAllLoaded] = useState(false)
  const totalDelay = projects.length * 50 + 500 // delay totale per tutte le animazioni

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllLoaded(true)
    }, totalDelay)
    return () => clearTimeout(timer)
  }, [totalDelay])

  return (
    <div className={`${styles.table} ${allLoaded ? '' : styles.loading}`}>
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
  )
}

