'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '../app/projects/projects.module.css'

// Versione mobile del titolo, con la stessa logica di resize del titolo desktop
// ma senza posizione fixed/sticky. Visibile solo su mobile tramite CSS.
export default function MobileTitle({ children }) {
  const titleRef = useRef(null)
  const [fontSize, setFontSize] = useState('clamp(32px, 12vw, 120px)')
  const [isMunchbergActive, setIsMunchbergActive] = useState(false)
  
  // Determina se Munchberg è attivo per mostrare il testo capitalize
  useEffect(() => {
    const checkMunchberg = () => {
      if (typeof document !== 'undefined') {
        const body = document.body
        const html = document.documentElement
        const isActive = body.classList.contains('font-munchberg') || html.classList.contains('font-munchberg')
        setIsMunchbergActive(isActive)
      }
    }
    
    checkMunchberg()
    // Controlla periodicamente se il font cambia
    const interval = setInterval(checkMunchberg, 100)
    
    // Ascolta i cambiamenti del DOM
    const observer = new MutationObserver(checkMunchberg)
    if (typeof document !== 'undefined') {
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    }
    
    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [])
  
  // Determina il testo da mostrare
  const displayText = isMunchbergActive && children === 'GIALLO.STUDIO' ? 'Giallo.Studio' : children

  useEffect(() => {
    const calculateFontSize = () => {
      if (!titleRef.current) return

      const element = titleRef.current

      // Larghezza target: ~94% della larghezza reale del contenitore
      const parent = element.parentElement
      const containerWidth = parent
        ? parent.getBoundingClientRect().width
        : window.innerWidth
      const targetWidth = containerWidth * 0.94

      // Crea un elemento temporaneo invisibile per misurare la larghezza del testo
      const measureEl = document.createElement('span')
      const computed = getComputedStyle(element)

      measureEl.style.position = 'absolute'
      measureEl.style.visibility = 'hidden'
      measureEl.style.whiteSpace = 'nowrap'
      measureEl.style.fontFamily = computed.fontFamily
      measureEl.style.fontWeight = computed.fontWeight
      measureEl.style.fontStyle = computed.fontStyle
      measureEl.style.textTransform = computed.textTransform
      measureEl.style.letterSpacing = computed.letterSpacing
      measureEl.style.fontSize = '100px' // Dimensione base per la misurazione
      measureEl.textContent = element.textContent || ''

      document.body.appendChild(measureEl)

      // Misura la larghezza effettiva del testo con il font corrente
      const textWidth = measureEl.offsetWidth

      // Rimuovi l'elemento temporaneo
      document.body.removeChild(measureEl)

      // Calcola il rapporto e applica la scala
      if (textWidth > 0) {
        const scale = targetWidth / textWidth
        const baseSize = 100 // Dimensione base usata per la misurazione
        const scaledSize = baseSize * scale

        // Usa un range ragionevole per il mobile
        const minSize = 28
        const maxSize = 140
        const finalSize = Math.max(minSize, Math.min(maxSize, scaledSize))

        setFontSize(`${finalSize}px`)
      }
    }

    // Calcolo iniziale dopo un piccolo delay per permettere al font di caricarsi
    const initialTimeout = setTimeout(() => {
      calculateFontSize()
    }, 100)

    // Ricalcola quando cambia la dimensione della finestra
    const handleResize = () => {
      calculateFontSize()
    }
    window.addEventListener('resize', handleResize)

    // Osserva i cambiamenti del font (come nel titolo desktop)
    const observer = new MutationObserver(() => {
      setTimeout(calculateFontSize, 150)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: false
    })

    // Ricalcola anche quando cambia il font tramite click (pulsante font)
    const handleClick = () => {
      setTimeout(calculateFontSize, 300)
    }
    document.addEventListener('click', handleClick)

    // Ricalcola periodicamente per catturare cambiamenti del font
    const interval = setInterval(() => {
      calculateFontSize()
    }, 1000)

    return () => {
      clearTimeout(initialTimeout)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClick)
      observer.disconnect()
      clearInterval(interval)
    }
  }, [children])

  return (
    <h1
      ref={titleRef}
      className={styles.mobileHomeTitle}
      style={{ fontSize }}
    >
      {displayText}
    </h1>
  )
}
