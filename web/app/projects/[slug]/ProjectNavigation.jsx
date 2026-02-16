'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './project.module.css'

export default function ProjectNavigation({ prevProject, nextProject }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight
      
      // Calcola le percentuali di scroll
      const scrollPercent = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0
      
      // Fade out a 90% dello scroll
      const shouldShow = scrollPercent < 90
      
      setIsVisible(shouldShow)
    }

    // Controlla immediatamente
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <nav className={`${styles.projectNav} ${!isVisible ? styles.hidden : ''}`}>
      <div className={styles.projectNavContent}>
        {prevProject && (
          <Link href={`/projects/${prevProject.slug.current}`} className={styles.navLink}>
            <span className={styles.navTextDesktop}>← prev. project: {prevProject.title}</span>
            <span className={styles.navTextMobile}>← previous</span>
          </Link>
        )}
        {nextProject && (
          <Link href={`/projects/${nextProject.slug.current}`} className={styles.navLink}>
            <span className={styles.navTextDesktop}>next project: {nextProject.title} →</span>
            <span className={styles.navTextMobile}>next →</span>
          </Link>
        )}
      </div>
    </nav>
  )
}

