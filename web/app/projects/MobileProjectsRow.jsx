'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import styles from './projects.module.css'

export default function MobileProjectsRow({ project, index = 0 }) {
  const descRef = useRef(null)
  const [animationDuration, setAnimationDuration] = useState(15)

  const orderRaw = project?.order ?? ""
  const orderNum = typeof orderRaw === "number" ? orderRaw : parseInt(orderRaw, 10)
  const orderFormatted = !isNaN(orderNum) && orderNum > 0 
    ? String(orderNum).padStart(3, '0')
    : ""
  
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
  
  const title = project?.title ?? ""
  const slug = project?.slug?.current
  const client = project?.info?.client?.value ?? ""
  const year = project?.info?.year?.value ?? ""
  const categoriesRaw = Array.isArray(project?.categories) ? project.categories : []
  const categories = categoriesRaw
    .map(cat => categoryMap[cat] || cat)
    .join(" / ")
  const desc = project?.description ?? ""

  // Stringa Client – Year con en dash
  const clientYearText = client && year
    ? `${client} – ${year}`
    : client || year

  // Calcola la durata dell'animazione basata sulla larghezza del testo per uniformare la velocità
  useEffect(() => {
    if (!descRef.current || !desc) return

    const calculateDuration = () => {
      const element = descRef.current
      if (!element) return

      const container = element.parentElement
      if (!container) return

      // La larghezza totale include il testo duplicato, quindi dividiamo per 2
      const totalTextWidth = element.scrollWidth
      const singleTextWidth = totalTextWidth / 2 // testo duplicato, quindi metà
      const containerWidth = container.clientWidth

      if (singleTextWidth > containerWidth) {
        // Velocità uniforme: circa 50px al secondo per una lettura confortevole
        const distance = singleTextWidth // distanza da percorrere (un testo completo)
        const duration = distance / 50 // secondi
        setAnimationDuration(Math.max(10, Math.min(duration, 60))) // min 10s, max 60s
      } else {
        // Se il testo non è più lungo del contenitore, non animare
        setAnimationDuration(0)
      }
    }

    // Calcola dopo che l'elemento è renderizzato
    const timer = setTimeout(calculateDuration, 100)
    window.addEventListener('resize', calculateDuration)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateDuration)
    }
  }, [desc])

  const RowWrapper = slug ? Link : "div"
  const rowProps = slug 
    ? { href: `/projects/${slug}`, className: styles.mobileTableRow } 
    : { className: styles.mobileTableRow }

  return (
    <RowWrapper {...rowProps}>
      <div className={styles.mobileRowContent}>
        {/* [Numero ordinamento] Nome - stesso rigo */}
        <div className={styles.mobileRowTitle}>
          {orderFormatted !== "" && (
            <span className={styles.mobileRowOrder}>[{orderFormatted}]</span>
          )}
          <span className={styles.mobileRowName}>{title}</span>
          <span className={styles.mobileRowArrow}>→</span>
        </div>

        {/* Description - rigo separato con effetto marquee */}
        {desc && (
          <div className={styles.mobileRowDescriptionWrapper}>
            <div 
              ref={descRef}
              className={styles.mobileRowDescription}
              style={{
                '--animation-duration': animationDuration > 0 ? `${animationDuration}s` : 'none'
              }}
            >
              <span className={styles.mobileRowDescriptionText}>{desc}</span>
              <span className={styles.mobileRowDescriptionText} aria-hidden="true">{desc}</span>
            </div>
          </div>
        )}

        {/* Category – Client – Year - stesso rigo */}
        {(categories || client || year) && (
          <div className={styles.mobileRowCategoryClientYear}>
            {categories && (
              <span className={styles.mobileRowCategory}>{categories}</span>
            )}
            {categories && (client || year) && <span className={styles.mobileRowSeparator}> – </span>}
            {(client || year) && (
              <span className={styles.mobileRowClientYear}>{clientYearText}</span>
            )}
          </div>
        )}
      </div>
    </RowWrapper>
  )
}
