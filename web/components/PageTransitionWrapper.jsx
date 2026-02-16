'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransitionWrapper({ children }) {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const isInitialMount = useRef(true)
  const [showOverlay, setShowOverlay] = useState(true) // Inizia con overlay visibile per fade in iniziale
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [bgColor, setBgColor] = useState('#ffffff')

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousPathname.current = pathname
      
      // Ottieni il colore di sfondo
      if (typeof window !== 'undefined') {
        const color = getComputedStyle(document.body).backgroundColor || '#ffffff'
        setBgColor(color)
      }
      
      // Fade in iniziale quando la pagina viene caricata
      setTimeout(() => {
        setShowOverlay(false)
      }, 50) // Breve delay per assicurarsi che tutto sia caricato
      return
    }

    if (previousPathname.current !== pathname) {
      // Ottieni il colore di sfondo
      if (typeof window !== 'undefined') {
        const color = getComputedStyle(document.body).backgroundColor || '#ffffff'
        setBgColor(color)
      }

      // FASE 1: Nascondi immediatamente il contenuto per evitare flash
      setIsFadingOut(true)
      setShowOverlay(true)
      
      // FASE 2: Dopo che il fade out è completato, cambia pagina e fade in
      setTimeout(() => {
        previousPathname.current = pathname
        setIsFadingOut(false)
        setShowOverlay(false)
      }, 800) // Aspetta che il fade out finisca (0.8s)
    }
  }, [pathname])

  return (
    <>
      <div
        style={{
          opacity: isFadingOut || showOverlay ? 0 : 1,
          transition: isFadingOut || showOverlay ? 'opacity 0.8s ease-in-out' : 'opacity 0.8s ease-in-out',
          visibility: isFadingOut && !showOverlay ? 'hidden' : 'visible',
        }}
      >
        {children}
      </div>
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: bgColor,
            zIndex: 999999,
            pointerEvents: 'none',
            opacity: 1,
          }}
        />
      )}
    </>
  )
}
