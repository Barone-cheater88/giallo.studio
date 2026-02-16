'use client'

import { useEffect, useRef, useState } from 'react'

export default function TitleSvgWrapper({ svgContent }) {
  const containerRef = useRef(null)
  const [currentColor, setCurrentColor] = useState('#000000')
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    // Funzione per ottenere il colore corrente
    const getCurrentColor = () => {
      return getComputedStyle(document.body).color || 
             getComputedStyle(document.documentElement).getPropertyValue('--color-text') ||
             '#000000'
    }

    // Funzione per aggiornare i colori dell'SVG quando cambia il colore del sito
    const updateSvgColors = () => {
      if (!containerRef.current) return
      
      const svg = containerRef.current.querySelector('svg')
      if (!svg) return

      const color = getCurrentColor()
      setCurrentColor(color)

      // Imposta il colore sul container
      containerRef.current.style.color = color
      svg.style.color = color

      // Applica currentColor a tutti gli elementi SVG che non hanno fill="none" o stroke="none"
      const allElements = svg.querySelectorAll('*')
      allElements.forEach(el => {
        const fill = el.getAttribute('fill')
        const stroke = el.getAttribute('stroke')
        
        // Forza currentColor su tutti gli elementi tranne quelli con none
        if (fill !== 'none' && fill !== null) {
          el.setAttribute('fill', 'currentColor')
          el.style.fill = 'currentColor'
          el.style.setProperty('fill', 'currentColor', 'important')
        }
        if (stroke !== 'none' && stroke !== null) {
          el.setAttribute('stroke', 'currentColor')
          el.style.stroke = 'currentColor'
          el.style.setProperty('stroke', 'currentColor', 'important')
        }
        
        // Rimuovi anche eventuali style inline che potrebbero sovrascrivere
        if (el.style.fill && el.style.fill !== 'none' && el.style.fill !== 'currentColor') {
          el.style.fill = 'currentColor'
          el.style.setProperty('fill', 'currentColor', 'important')
        }
        if (el.style.stroke && el.style.stroke !== 'none' && el.style.stroke !== 'currentColor') {
          el.style.stroke = 'currentColor'
          el.style.setProperty('stroke', 'currentColor', 'important')
        }
      })
      
      // Applica anche direttamente al tag SVG
      svg.style.color = color
      svg.style.setProperty('color', color, 'important')
      // Applica il filtro drop-shadow con il colore corrente
      svg.style.filter = `drop-shadow(0 0 3px ${color})`
    }

    // Aggiorna i colori inizialmente
    setTimeout(updateSvgColors, 100)
    setTimeout(updateSvgColors, 500) // Doppio check iniziale

    // Osserva i cambiamenti di stile sul body e documentElement
    const observer = new MutationObserver(() => {
      setTimeout(updateSvgColors, 10)
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: false
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: false
    })

    // Aggiorna anche quando cambia il colore tramite variabili CSS - più frequente
    const interval = setInterval(() => {
      updateSvgColors()
    }, 100)

    // Ascolta anche i cambiamenti di colore dal Header
    const handleColorChange = () => {
      setTimeout(updateSvgColors, 10)
    }
    window.addEventListener('colorchange', handleColorChange)
    
    // Ascolta anche i click sul menu (potrebbe essere il pulsante Color)
    const handleClick = () => {
      setTimeout(updateSvgColors, 100)
    }
    document.addEventListener('click', handleClick)

    return () => {
      observer.disconnect()
      clearInterval(interval)
      window.removeEventListener('colorchange', handleColorChange)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Gestisce l'opacità in base allo scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Calcola l'opacità: inizia a diminuire dopo 100px di scroll, diventa 0 a 500px
      const startFade = 100
      const endFade = 500
      let newOpacity = 1
      
      if (scrollY > startFade) {
        const fadeRange = endFade - startFade
        const scrollProgress = scrollY - startFade
        newOpacity = Math.max(0, 1 - (scrollProgress / fadeRange))
      }
      
      setOpacity(newOpacity)
    }

    handleScroll() // Imposta l'opacità iniziale
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!svgContent) return null

  return (
    <div
      ref={containerRef}
      className="titleSvgContainer"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0,
        textAlign: 'center',
        color: currentColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: opacity,
        transition: 'opacity 0.1s ease-out'
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
