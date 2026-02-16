'use client'

import { useEffect, useRef, useState } from 'react'

export default function RevealOnScroll({ children, className = '' }) {
  const containerRef = useRef(null)
  const [revealProgress, setRevealProgress] = useState(0)
  const hasStartedReveal = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Controlla immediatamente se l'elemento è già visibile
    const checkVisibility = () => {
      const rect = container.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0
      
      if (isVisible && !hasStartedReveal.current) {
        hasStartedReveal.current = true
        // Delay minimo prima di iniziare l'animazione
        setTimeout(() => {
          // Anima il progresso da 0 a 1 (rivelazione dal basso all'alto)
          const duration = 550 // 0.55 secondi per l'animazione
          const startTime = performance.now()
          
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            // Usa easing per fluidità (ease-out)
            const t = Math.min(1, elapsed / duration)
            const eased = 1 - Math.pow(1 - t, 3) // Cubic ease-out
            setRevealProgress(eased)
            
            if (t < 1) {
              requestAnimationFrame(animate)
            } else {
              setRevealProgress(1) // Assicura che sia esattamente 1 alla fine
            }
          }
          
          requestAnimationFrame(animate)
        }, 100) // Delay minimo di 100ms
      }
    }

    // Controlla subito
    checkVisibility()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Quando l'elemento entra nella viewport, inizia la rivelazione
          if (entry.isIntersecting && !hasStartedReveal.current) {
            hasStartedReveal.current = true
            // Delay minimo prima di iniziare l'animazione
            setTimeout(() => {
              // Anima il progresso da 0 a 1 (rivelazione dal basso all'alto)
              const duration = 400 // 0.4 secondi per l'animazione (molto veloce)
              const startTime = performance.now()
              
              const animate = (currentTime) => {
                const elapsed = currentTime - startTime
                // Usa easing per fluidità (ease-out)
                const t = Math.min(1, elapsed / duration)
                const eased = 1 - Math.pow(1 - t, 3) // Cubic ease-out
                setRevealProgress(eased)
                
                if (t < 1) {
                  requestAnimationFrame(animate)
                } else {
                  setRevealProgress(1) // Assicura che sia esattamente 1 alla fine
                }
              }
              
              requestAnimationFrame(animate)
            }, 100) // Delay minimo di 100ms
          }
        })
      },
      {
        threshold: 0.01, // Inizia quando almeno l'1% è visibile
        rootMargin: '100px 0px', // Trigger prima che entri completamente
      }
    )

    observer.observe(container)

    // Fallback: controlla anche durante lo scroll
    const handleScroll = () => {
      if (!hasStartedReveal.current) {
        checkVisibility()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Calcola il clip-path: maschera che si espande da sinistra verso destra
  // revealProgress va da 0 (completamente nascosto) a 1 (completamente visibile)
  // inset(top right bottom left) - right diminuisce da 100% a 0%
  const clipPath = revealProgress >= 1 
    ? 'none' 
    : `inset(0 ${(1 - revealProgress) * 100}% 0 0)`

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        clipPath: clipPath,
        willChange: revealProgress < 1 ? 'clip-path' : 'auto',
      }}
    >
      {children}
    </div>
  )
}
