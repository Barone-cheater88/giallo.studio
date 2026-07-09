'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const isInitialMount = useRef(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [bgColor, setBgColor] = useState('#ffffff')

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      previousPathname.current = pathname
      return
    }

    if (previousPathname.current !== pathname) {
      // Ottieni il colore di sfondo - TEMPORANEAMENTE usa rosso per test
      if (typeof window !== 'undefined') {
        setBgColor('#ff0000') // Forza rosso per vedere se appare
      }

      // Fade out
      setIsTransitioning(true)
      
      // Fade in dopo delay più lungo per vedere l'animazione
      setTimeout(() => {
        setIsTransitioning(false)
        previousPathname.current = pathname
      }, 600) // 600ms per vedere meglio l'animazione
    }
  }, [pathname])

  return (
    <>
      <div
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
        }}
      >
        {children}
      </div>
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: bgColor || '#ffffff', // Fallback bianco
            zIndex: 999999,
            pointerEvents: 'none',
            opacity: 1,
            transition: 'opacity 0.6s ease-in-out',
          }}
        />
      )}
    </>
  )
}
