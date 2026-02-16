'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './FloatingLogo.module.css'

export default function FloatingLogo({ logoSvg, logo }) {
  const [containerBgColor, setContainerBgColor] = useState('#ffffff')
  const [logoSvgContent, setLogoSvgContent] = useState(null)
  const [logoBgColor, setLogoBgColor] = useState('#ffffff')
  const [bottomOffset, setBottomOffset] = useState(0)

  // Carica il contenuto SVG
  useEffect(() => {
    const logoSrc = logoSvg?.asset?.url || logo?.asset?.url
    if (!logoSrc) {
      setLogoSvgContent(null)
      return
    }

    // Carica sempre come testo per modificare il fill
    fetch(logoSrc)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.text()
      })
      .then(svgText => {
        // Verifica che sia un SVG
        if (svgText && (svgText.trim().startsWith('<svg') || svgText.includes('<svg'))) {
          setLogoSvgContent(svgText)
        } else {
          setLogoSvgContent(null)
        }
      })
      .catch(err => {
        console.error('Error loading SVG:', err)
        setLogoSvgContent(null)
      })
  }, [logoSvg, logo])

  // Gestisce il colore del container e del logo
  useEffect(() => {
    const checkColors = () => {
      // Usa la stessa logica dell'Header per ottenere il colore di sfondo
      const dynamicBg = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-background').trim()
      const currentBg = getComputedStyle(document.body).backgroundColor
      const bgColor = dynamicBg || currentBg
      
      // Ottieni il colore del testo dalla variabile CSS
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim() || getComputedStyle(document.body).color
      setContainerBgColor(textColor || '#ffffff')
      
      // Logo = colore dello sfondo della pagina
      setLogoBgColor(bgColor || '#ffffff')
    }

    // Controlla immediatamente
    checkColors()

    // Ascolta i cambiamenti
    const observer = new MutationObserver(() => {
      checkColors()
    })
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    // Controlla anche quando cambia la variabile CSS (come nell'Header)
    const checkInterval = setInterval(checkColors, 50)

    return () => {
      observer.disconnect()
      clearInterval(checkInterval)
    }
  }, [])

  // Calcola quando siamo al fondo della pagina per appoggiare il logo sul footer
  useEffect(() => {
    const updateBottomOffset = () => {
      const footer = document.querySelector('footer')
      if (!footer) {
        setBottomOffset(0)
        return
      }

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const footerTop = footer.offsetTop
      const footerHeight = footer.offsetHeight

      // Se siamo al fondo della pagina (il footer è visibile o siamo oltre)
      if (scrollTop + windowHeight >= footerTop) {
        // Calcola quanto spazio c'è tra il fondo della viewport e il footer
        const spaceBelow = scrollTop + windowHeight - footerTop
        // Se c'è spazio, il logo si appoggia sul footer
        if (spaceBelow >= 0) {
          setBottomOffset(footerHeight)
        } else {
          setBottomOffset(0)
        }
      } else {
        // Non siamo ancora al footer, logo in fondo alla viewport
        setBottomOffset(0)
      }
    }

    updateBottomOffset()
    window.addEventListener('resize', updateBottomOffset)
    window.addEventListener('scroll', updateBottomOffset)

    // Osserva i cambiamenti nel footer (es. quando si apre il banner contatti)
    const footerObserver = new MutationObserver(updateBottomOffset)
    const footer = document.querySelector('footer')
    if (footer) {
      footerObserver.observe(footer, {
        childList: true,
        subtree: true,
        attributes: true
      })
    }

    return () => {
      window.removeEventListener('resize', updateBottomOffset)
      window.removeEventListener('scroll', updateBottomOffset)
      footerObserver.disconnect()
    }
  }, [])

  // Usa prima logoSvg se disponibile, altrimenti logo
  const logoSrc = logoSvg?.asset?.url || logo?.asset?.url

  // Converte il colore in formato hex se necessario
  const getColorHex = (color) => {
    if (!color) return '#ffffff'
    const normalized = color.trim()
    if (normalized.startsWith('#')) {
      return normalized
    }
    if (normalized.startsWith('rgb')) {
      // Converte RGB in hex
      const rgbMatch = normalized.match(/\d+/g)
      if (rgbMatch && rgbMatch.length >= 3) {
        const r = parseInt(rgbMatch[0]).toString(16).padStart(2, '0')
        const g = parseInt(rgbMatch[1]).toString(16).padStart(2, '0')
        const b = parseInt(rgbMatch[2]).toString(16).padStart(2, '0')
        return `#${r}${g}${b}`
      }
    }
    return normalized
  }

  const logoColorHex = getColorHex(logoBgColor)

  // Modifica l'SVG per cambiare il fill al colore dello sfondo
  const modifiedSvg = logoSvgContent ? (() => {
    let modified = logoSvgContent
    
    // Rimuovi tutti i fill esistenti
    modified = modified.replace(/fill="[^"]*"/g, '')
    modified = modified.replace(/fill='[^']*'/g, '')
    modified = modified.replace(/fill:\s*[^;]+;?/g, '')
    
    // Aggiungi il nuovo fill a tutti gli elementi che non hanno già un fill
    // Prima aggiungilo al tag svg principale
    modified = modified.replace(/<svg([^>]*)>/, `<svg$1 style="width: 100%; height: 100%;">`)
    
    // Poi aggiungi fill a tutti gli elementi path, rect, circle, etc. che non hanno fill
    modified = modified.replace(/<(path|rect|circle|ellipse|polygon|polyline|line|g)([^>]*?)(?:\s+fill="[^"]*")?([^>]*)>/gi, (match, tag, attrs1, fillAttr, attrs2) => {
      const allAttrs = (attrs1 || '') + (attrs2 || '')
      if (!allAttrs.includes('fill=')) {
        return `<${tag}${allAttrs} fill="${logoColorHex}">`
      }
      return match.replace(/fill="[^"]*"/g, `fill="${logoColorHex}"`)
    })
    
    // Se non ci sono elementi con fill, aggiungilo al primo elemento
    if (!modified.includes('fill=')) {
      modified = modified.replace(/<(path|rect|circle|ellipse|polygon|polyline|line|g)([^>]*)>/i, `<$1$2 fill="${logoColorHex}">`)
    }
    
    return modified
  })() : null

  return (
    <Link 
      href="/" 
      className={styles.floatingLogo}
      style={{
        bottom: `${bottomOffset}px`
      }}
    >
      <div 
        className={styles.logoContainer}
        style={{
          backgroundColor: containerBgColor,
          transition: 'background-color 0.3s ease'
        }}
      >
        {modifiedSvg ? (
          <div 
            className={styles.logo}
            dangerouslySetInnerHTML={{ __html: modifiedSvg }}
            style={{
              width: 'auto',
              height: '30px',
              maxWidth: '75px',
              display: 'block'
            }}
          />
        ) : logoSrc ? (
          <img
            src={logoSrc}
            alt="Logo"
            className={styles.logo}
            style={{ 
              filter: logoBgColor === '#000000' || logoColorHex === '#000000' ? 'brightness(0)' : 
                      logoBgColor === '#f0f0f0' || logoColorHex === '#f0f0f0' ? 'brightness(0) saturate(100%) invert(94%)' : 
                      logoBgColor === '#ef0000' || logoColorHex === '#ef0000' ? 'brightness(0) saturate(100%) invert(6%) sepia(100%) saturate(7492%) hue-rotate(0deg) brightness(94%) contrast(118%)' :
                      'brightness(0) invert(1)',
              transition: 'filter 0.3s ease'
            }}
          />
        ) : null}
      </div>
    </Link>
  )
}

