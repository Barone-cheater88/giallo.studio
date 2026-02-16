'use client'

import { useEffect, useRef, useState } from 'react'

export default function ResponsiveTitleNonFixed({ children }) {
  const titleRef = useRef(null)
  const [fontSize, setFontSize] = useState('clamp(48px, 12vw, 200px)')
  const [isVisible, setIsVisible] = useState(true)
  
  // Inizializza isMobile immediatamente controllando window
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 767
    }
    return false
  })

  useEffect(() => {
    const calculateFontSize = () => {
      if (!titleRef.current) return

      const targetWidth = window.innerWidth * 0.97
      const element = titleRef.current
      
      const measureEl = document.createElement('span')
      measureEl.style.position = 'absolute'
      measureEl.style.visibility = 'hidden'
      measureEl.style.whiteSpace = 'nowrap'
      measureEl.style.fontFamily = getComputedStyle(element).fontFamily
      measureEl.style.fontWeight = getComputedStyle(element).fontWeight
      measureEl.style.fontStyle = getComputedStyle(element).fontStyle
      measureEl.style.textTransform = getComputedStyle(element).textTransform
      measureEl.style.fontSize = '100px'
      measureEl.textContent = children
      
      document.body.appendChild(measureEl)
      const textWidth = measureEl.offsetWidth
      document.body.removeChild(measureEl)
      
      if (textWidth > 0) {
        const scale = targetWidth / textWidth
        const baseSize = 100
        const scaledSize = baseSize * scale
        const minSize = 48
        const maxSize = 200
        const finalSize = Math.max(minSize, Math.min(maxSize, scaledSize))
        setFontSize(`${finalSize}px`)
      }
    }

    const initialTimeout = setTimeout(() => {
      calculateFontSize()
      setTimeout(() => {
        setIsVisible(true)
      }, 400)
    }, 100)

    const handleResize = () => {
      calculateFontSize()
      const mobile = window.innerWidth <= 767
      setIsMobile(mobile)
    }
    window.addEventListener('resize', handleResize)

    const observer = new MutationObserver(() => {
      setTimeout(calculateFontSize, 150)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: false
    })

    const handleClick = () => {
      setTimeout(calculateFontSize, 300)
    }
    document.addEventListener('click', handleClick)

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

  // FORZA position static su mobile - eseguito continuamente
  useEffect(() => {
    if (!titleRef.current) return
    
    const forceStatic = () => {
      if (!titleRef.current) return
      const mobile = window.innerWidth <= 767
      if (mobile) {
        // FORZA position static con setProperty per massima priorità
        titleRef.current.style.setProperty('position', 'static', 'important')
        titleRef.current.style.setProperty('top', 'auto', 'important')
        titleRef.current.style.setProperty('left', 'auto', 'important')
        titleRef.current.style.setProperty('right', 'auto', 'important')
        titleRef.current.style.setProperty('bottom', 'auto', 'important')
        titleRef.current.style.setProperty('transform', 'none', 'important')
        titleRef.current.style.setProperty('z-index', 'auto', 'important')
      }
    }
    
    forceStatic()
    const interval = setInterval(forceStatic, 100) // Controlla ogni 100ms
    window.addEventListener('resize', forceStatic)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', forceStatic)
    }
  }, [])

  return (
    <h1
      ref={titleRef}
      className="responsive-title-non-fixed"
      style={{
        position: isMobile ? 'static' : 'relative',
        width: '97vw',
        maxWidth: '100%',
        fontSize: fontSize,
        fontWeight: 'inherit',
        fontStyle: 'inherit',
        fontFamily: 'inherit',
        lineHeight: '1',
        margin: '0 auto',
        padding: 0,
        textAlign: 'center',
        color: 'inherit',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.6s ease-in-out',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </h1>
  )
}
