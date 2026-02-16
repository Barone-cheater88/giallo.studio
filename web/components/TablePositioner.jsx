'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '../app/projects/projects.module.css'

export default function TablePositioner({ children }) {
  const tableRef = useRef(null)
  const [marginTop, setMarginTop] = useState('25vh') // Fallback iniziale

  useEffect(() => {
    const calculateInitialPosition = () => {
      // Solo su desktop
      if (window.innerWidth <= 890) {
        setMarginTop('25vh') // Fallback per mobile
        return
      }

      // Trova il titolo (ResponsiveTitle)
      const titleElement = document.querySelector('[data-responsive-title]')
      if (!titleElement || !tableRef.current) return

      // Il titolo è fixed, quindi calcoliamo la sua posizione iniziale (quando scrollY = 0)
      // Per Munchberg: initialTop = 150px, per altri: initialTop = 120px
      const computedStyle = getComputedStyle(titleElement)
      const fontFamily = computedStyle.fontFamily
      const isMunchberg = fontFamily.includes('Munchberg')
      const initialTop = isMunchberg ? 150 : 120
      
      // Misura l'altezza del titolo
      const titleRect = titleElement.getBoundingClientRect()
      const titleHeight = titleRect.height || 0
      
      // Calcola la posizione del content container
      const contentElement = tableRef.current.closest('.content') || tableRef.current.parentElement
      if (!contentElement) return
      
      const contentRect = contentElement.getBoundingClientRect()
      const scrollY = window.scrollY || 0
      
      // La posizione assoluta del content rispetto al top del documento
      const contentTop = contentRect.top + scrollY
      
      // Calcola il margin-top: posizione iniziale del titolo + altezza + 20px - posizione del content
      // Il titolo è fixed, quindi la sua posizione iniziale è sempre initialTop dal top del viewport
      // Quando scrollY = 0, il content è a contentTop dal top del documento
      // Quindi: margin-top = initialTop + titleHeight + 20 - contentTop
      const tableMarginTop = initialTop + titleHeight + 20 - contentTop
      
      // Imposta il margin-top (minimo 0 per evitare valori negativi)
      setMarginTop(`${Math.max(0, tableMarginTop)}px`)
    }

    // Calcola la posizione iniziale con diversi delay per assicurarsi che tutto sia caricato
    const timeouts = [
      setTimeout(calculateInitialPosition, 200),
      setTimeout(calculateInitialPosition, 500),
      setTimeout(calculateInitialPosition, 1000)
    ]

    // Aggiorna su resize (ma non su scroll, perché vogliamo una posizione fissa)
    window.addEventListener('resize', calculateInitialPosition)

    // Aggiorna quando cambia il font (per gestire Munchberg)
    const observer = new MutationObserver(() => {
      setTimeout(calculateInitialPosition, 200)
    })
    
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'style']
      })
    }

    // Aggiorna quando cambia il font family del titolo
    const titleElement = document.querySelector('[data-responsive-title]')
    if (titleElement) {
      const fontObserver = new MutationObserver(() => {
        setTimeout(calculateInitialPosition, 300)
      })
      
      fontObserver.observe(titleElement, {
        attributes: true,
        attributeFilter: ['style']
      })
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
      window.removeEventListener('resize', calculateInitialPosition)
      observer.disconnect()
    }
  }, [])

  return (
    <div 
      ref={tableRef}
      className={styles.table}
      style={{ marginTop }}
    >
      {children}
    </div>
  )
}
