'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Preloader({ logoSvg, logo }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [logoSvgContent, setLogoSvgContent] = useState(null)

  // Mostra il preloader solo sulla home page
  const isHomePage = pathname === '/'

  // Carica il logo SVG
  useEffect(() => {
    if (!isHomePage) {
      setIsLoading(false)
      return
    }

    const logoSvgUrl = logoSvg?.asset?.url
    if (logoSvgUrl && typeof logoSvgUrl === 'string' && (logoSvgUrl.startsWith('http') || logoSvgUrl.startsWith('https'))) {
      fetch(logoSvgUrl, { cache: 'no-store' })
        .then(res => res.ok ? res.text() : null)
        .then(svgText => {
          if (svgText) {
            // Sostituisci fill e stroke con currentColor
            // Sostituisci fill e stroke con #ffffff (bianco) per il preloader
            const modifiedSvg = svgText
              .replace(/fill="(?!none)[^"]*"/g, 'fill="#ffffff"')
              .replace(/stroke="(?!none)[^"]*"/g, 'stroke="#ffffff"')
              .replace(/fill='(?!none)[^']*'/g, "fill='#ffffff'")
              .replace(/stroke='(?!none)[^']*'/g, "stroke='#ffffff'")
              // Assicurati che anche gli elementi senza fill/stroke esplicito usino il colore bianco
              .replace(/<svg([^>]*)>/i, '<svg$1 style="fill: #ffffff; stroke: #ffffff;">')
            setLogoSvgContent(modifiedSvg)
          }
        })
        .catch(() => {
          setLogoSvgContent(null)
        })
    } else {
      setLogoSvgContent(null)
    }
  }, [logoSvg, isHomePage])

  // Nascondi il preloader quando la pagina è caricata
  useEffect(() => {
    if (!isHomePage) {
      setIsLoading(false)
      return
    }

    // Aspetta che tutto sia caricato
    const handleLoad = () => {
      // Piccolo delay per assicurarsi che tutto sia renderizzato
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [isHomePage])

  if (!isHomePage || !isLoading) {
    return null
  }

  const logoSrc = logoSvg?.asset?.url || logo?.asset?.url

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000', // Sfondo nero per preloader
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: isLoading ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          width: '60px',
          height: '60px',
          color: '#ffffff', // Logo bianco per preloader
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {logoSvgContent ? (
          <div
            dangerouslySetInnerHTML={{ __html: logoSvgContent }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          />
        ) : logoSrc ? (
          <img
            src={logoSrc}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)', // Trasforma il logo in bianco
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
