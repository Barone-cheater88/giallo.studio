'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '../app/projects/projects.module.css'

export default function MobileTitleFixed({ children }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const marqueeRef = useRef(null)
  const [animationDuration, setAnimationDuration] = useState(15)

  // Evita errori di hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Determina se Munchberg è attivo per mostrare il testo capitalize
  const [isMunchbergActive, setIsMunchbergActive] = useState(false)
  
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
  
  // Testo ripetuto per il marquee - capitalize se Munchberg è attivo
  const marqueeText = isMunchbergActive 
    ? 'Giallo.Studio – Giallo.Studio – Giallo.Studio –'
    : 'GIALLO.STUDIO – GIALLO.STUDIO – GIALLO.STUDIO –'

  // Calcola la durata dell'animazione basata sulla larghezza del testo (stessa logica delle descrizioni)
  useEffect(() => {
    if (!marqueeRef.current || !isMounted) return

    const calculateDuration = () => {
      const element = marqueeRef.current
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
        // Se il testo non è più lungo del contenitore, anima comunque ma più veloce
        setAnimationDuration(15) // durata di default
      }
    }

    // Calcola dopo che l'elemento è renderizzato, con più delay per Safari
    const timer = setTimeout(calculateDuration, 200)
    const timer2 = setTimeout(calculateDuration, 500)
    window.addEventListener('resize', calculateDuration)

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      window.removeEventListener('resize', calculateDuration)
    }
  }, [isMounted, marqueeText])

  // Allinea il titolo fisso al bordo inferiore dell'header (altezza reale, cambia con il font)
  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return

    const header = document.querySelector('header')
    if (!header) return

    const syncTopToHeader = () => {
      if (window.innerWidth > 890) {
        document.documentElement.style.removeProperty('--mobile-fixed-title-top')
        return
      }
      const h = header.getBoundingClientRect().height
      document.documentElement.style.setProperty(
        '--mobile-fixed-title-top',
        `${Math.round(h * 1000) / 1000}px`
      )
    }

    syncTopToHeader()
    const ro = new ResizeObserver(syncTopToHeader)
    ro.observe(header)
    window.addEventListener('resize', syncTopToHeader)
    window.addEventListener('orientationchange', syncTopToHeader)
    if (document.fonts?.addEventListener) {
      document.fonts.addEventListener('loadingdone', syncTopToHeader)
    }
    if (document.fonts?.ready) {
      document.fonts.ready.then(syncTopToHeader).catch(() => {})
    }

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncTopToHeader)
      window.removeEventListener('orientationchange', syncTopToHeader)
      document.fonts?.removeEventListener?.('loadingdone', syncTopToHeader)
      document.documentElement.style.removeProperty('--mobile-fixed-title-top')
    }
  }, [isMounted])

  // Gestisce la visibilità in base allo scroll
  useEffect(() => {
    if (!isMounted) return
    // Solo su mobile
        if (typeof window === 'undefined' || window.innerWidth > 890) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      // Appare gradualmente dopo 100px di scroll, completamente visibile a 200px
      const startFade = 100
      const endFade = 200
      
      if (scrollY < startFade) {
        setIsVisible(false)
      } else if (scrollY >= endFade) {
        setIsVisible(true)
      } else {
        // Fade graduale ma non troppo lento
        const progress = (scrollY - startFade) / (endFade - startFade)
        setIsVisible(progress > 0.3) // Appare più velocemente
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMounted])

  if (!isMounted) {
    return null
  }

  return (
    <h1
      className={`${styles.mobileHomeTitleFixed} ${isVisible ? styles.visible : ''}`}
    >
      <span className={styles.mobileHomeTitleFixedMarquee}>
        <div 
          ref={marqueeRef}
          className={styles.mobileHomeTitleFixedMarqueeInner}
          style={{
            '--animation-duration': animationDuration > 0 ? `${animationDuration}s` : '15s'
          }}
        >
          <span className={styles.mobileHomeTitleFixedText}>{marqueeText}</span>
          <span className={styles.mobileHomeTitleFixedText} aria-hidden="true">{marqueeText}</span>
        </div>
      </span>
    </h1>
  )
}
