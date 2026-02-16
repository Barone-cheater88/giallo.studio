'use client'

import { useEffect, useRef } from 'react'

export default function ProjectsScrollSync() {
  const scrollPositionRef = useRef(0)
  const leftColumnRef = useRef(null)
  const rightColumnRef = useRef(null)
  const rafIdRef = useRef(null)
  const heightsRef = useRef({ left: 0, right: 0, oneCopyLeft: 0, oneCopyRight: 0 })

  useEffect(() => {
    // Blocca lo scroll della pagina
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const leftColumn = document.getElementById('leftColumn')
    const rightColumn = document.getElementById('rightColumn')
    if (!leftColumn || !rightColumn) return

    leftColumnRef.current = leftColumn
    rightColumnRef.current = rightColumn

    // Calcola le altezze una volta all'inizio e quando necessario
    const updateHeights = () => {
      const leftColumnHeight = leftColumn.scrollHeight
      const rightColumnHeight = rightColumn.scrollHeight
      heightsRef.current = {
        left: leftColumnHeight,
        right: rightColumnHeight,
        oneCopyLeft: leftColumnHeight / 3,
        oneCopyRight: rightColumnHeight / 3
      }
    }

    // Inizializza le altezze
    updateHeights()

    // Funzione helper per normalizzare la posizione
    const normalizePosition = (position, maxHeight) => {
      if (maxHeight <= 0) return 0
      let normalized = position % maxHeight
      if (normalized < 0) {
        normalized += maxHeight
      }
      return normalized
    }

    // Funzione per aggiornare la posizione visiva (usata con requestAnimationFrame)
    const updatePosition = () => {
      const { oneCopyLeft, oneCopyRight } = heightsRef.current
      
      const visualPositionLeft = normalizePosition(scrollPositionRef.current, oneCopyLeft)
      const visualPositionRight = normalizePosition(scrollPositionRef.current, oneCopyRight)
      
      // Applica la trasformazione alla colonna sinistra (scroll normale)
      leftColumn.style.transform = `translateY(${-visualPositionLeft}px)`
      
      // Applica la trasformazione alla colonna destra (scroll inverso)
      const inverseScroll = oneCopyRight - visualPositionRight
      rightColumn.style.transform = `translateY(${-inverseScroll}px)`
      
      rafIdRef.current = null
    }

    const handleWheel = (e) => {
      e.preventDefault()
      
      // Aggiorna la posizione dello scroll virtuale
      scrollPositionRef.current += e.deltaY
      
      // Ricalcola le altezze occasionalmente (ogni 100 eventi circa)
      if (Math.abs(scrollPositionRef.current) % 5000 < Math.abs(e.deltaY)) {
        updateHeights()
      }
      
      // Usa requestAnimationFrame per ottimizzare il rendering
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updatePosition)
      }
    }

    // Gestisci anche il touch per mobile
    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY
      
      // Simula lo scroll con il touch
      scrollPositionRef.current += deltaY * 2
      
      // Ricalcola le altezze occasionalmente
      if (Math.abs(scrollPositionRef.current) % 5000 < Math.abs(deltaY * 2)) {
        updateHeights()
      }
      
      // Usa requestAnimationFrame per ottimizzare il rendering
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(updatePosition)
      }
      
      touchStartY = touchY
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return null
}
