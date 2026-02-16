'use client'

import { useEffect, useRef, useState } from 'react'

export default function ResponsiveTitle({ children }) {
  const titleRef = useRef(null)
  const fixedTitleRef = useRef(null)
  const measureRef = useRef(null)
  const [fontSize, setFontSize] = useState('clamp(48px, 12vw, 200px)')
  const [isSticky, setIsSticky] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMunchbergFont, setIsMunchbergFont] = useState(false)
  const [isDottyFont, setIsDottyFont] = useState(false)

  useEffect(() => {
    // Aggiorna anche il titolo fixed quando cambia il font size
    const updateFixedTitle = (size) => {
      if (fixedTitleRef.current) {
        fixedTitleRef.current.style.fontSize = size
      }
    }

    const calculateFontSize = () => {
      if (!titleRef.current) return

      const targetWidth = window.innerWidth * 0.97 // 97vw
      const element = titleRef.current
      
      // Determina il testo da misurare (Giallo.Studio se Munchberg, altrimenti GIALLO.STUDIO)
      const fontFamily = getComputedStyle(element).fontFamily
      const isMunchberg = fontFamily.includes('Munchberg')
      const isDotty = fontFamily.includes('Dotty')
      const textToMeasure = isMunchberg && children === 'GIALLO.STUDIO' ? 'Giallo.Studio' : children
      
      // Crea un elemento temporaneo invisibile per misurare la larghezza del testo
      const measureEl = document.createElement('span')
      measureEl.style.position = 'absolute'
      measureEl.style.visibility = 'hidden'
      measureEl.style.whiteSpace = 'nowrap'
      measureEl.style.fontFamily = fontFamily
      measureEl.style.fontWeight = getComputedStyle(element).fontWeight
      measureEl.style.fontStyle = getComputedStyle(element).fontStyle
      measureEl.style.textTransform = isMunchberg ? 'none' : (isDotty ? 'uppercase' : getComputedStyle(element).textTransform)
      measureEl.style.fontSize = '100px' // Dimensione base per la misurazione
      measureEl.style.letterSpacing = getComputedStyle(element).letterSpacing || 'normal'
      measureEl.textContent = textToMeasure
      
      // Forza il rendering del font prima di misurare
      measureEl.style.fontDisplay = 'block'
      
      // Funzione helper per calcolare la dimensione del font
      const calculateWithWidth = (textWidth, targetWidth) => {
        // Calcola il rapporto e applica la scala
        if (textWidth > 0) {
          const scale = targetWidth / textWidth
          const baseSize = 100 // Dimensione base usata per la misurazione
          const scaledSize = baseSize * scale
          
          // Applica con clamp per mantenere un range ragionevole
          const minSize = 48
          const maxSize = 200
          const finalSize = Math.max(minSize, Math.min(maxSize, scaledSize))
          const fontSizeStr = `${finalSize}px`
          
          setFontSize(fontSizeStr)
          updateFixedTitle(fontSizeStr)
        }
      }
      
      document.body.appendChild(measureEl)
      
      // Forza il browser a renderizzare il font prima di misurare
      // Usa requestAnimationFrame per assicurarsi che il font sia caricato
      requestAnimationFrame(() => {
        // Misura la larghezza effettiva del testo con il font corrente
        const textWidth = measureEl.offsetWidth
        
        // Se la larghezza è 0 o molto piccola, potrebbe essere che il font non sia ancora caricato
        // Riprova dopo un breve delay
        if (textWidth === 0 || textWidth < 10) {
          setTimeout(() => {
            const retryWidth = measureEl.offsetWidth
            if (retryWidth > 0) {
              calculateWithWidth(retryWidth, targetWidth)
            }
            if (document.body.contains(measureEl)) {
              document.body.removeChild(measureEl)
            }
          }, 200)
        } else {
          calculateWithWidth(textWidth, targetWidth)
          if (document.body.contains(measureEl)) {
            document.body.removeChild(measureEl)
          }
        }
      })
    }

    // Calcola inizialmente dopo un piccolo delay per permettere al font di caricarsi
    const initialTimeout = setTimeout(() => {
      calculateFontSize()
      // Mostra il titolo con un delay per evitare il flash iniziale
      setTimeout(() => {
        setIsVisible(true)
      }, 400) // Delay di 400ms dopo il calcolo
    }, 100)

    // Ricalcola quando cambia la dimensione della finestra
    const handleResize = () => {
      calculateFontSize()
    }
    window.addEventListener('resize', handleResize)

    // Osserva i cambiamenti del font (attraverso le variabili CSS)
    const observer = new MutationObserver(() => {
      // Ricalcola con diversi delay per assicurarsi che il font sia caricato
      setTimeout(calculateFontSize, 150)
      setTimeout(calculateFontSize, 500)
      setTimeout(calculateFontSize, 1000) // Delay più lungo per font personalizzati
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: false
    })

    // Osserva anche l'elemento del titolo per cambiamenti del font-family
    // Usa un timeout per assicurarsi che titleRef.current sia disponibile
    const titleObserverTimeout = setTimeout(() => {
      if (titleRef.current) {
        const titleObserver = new MutationObserver(() => {
          // Ricalcola con diversi delay per assicurarsi che il font sia caricato
          setTimeout(calculateFontSize, 200)
          setTimeout(calculateFontSize, 600)
          setTimeout(calculateFontSize, 1200) // Delay più lungo per font personalizzati
        })
        
        titleObserver.observe(titleRef.current, {
          attributes: true,
          attributeFilter: ['style'],
          subtree: false
        })
        
        // Salva l'observer per il cleanup
        if (titleRef.current) {
          titleRef.current._titleObserver = titleObserver
        }
      }
    }, 100)

    // Ricalcola anche quando cambia il font tramite click (potrebbe essere il pulsante font)
    const handleClick = () => {
      // Ricalcola con diversi delay per assicurarsi che il font sia caricato
      setTimeout(calculateFontSize, 300)
      setTimeout(calculateFontSize, 600)
      setTimeout(calculateFontSize, 1200) // Delay più lungo per font personalizzati
    }
    document.addEventListener('click', handleClick)

    // Ricalcola periodicamente per catturare cambiamenti del font
    const interval = setInterval(() => {
      calculateFontSize()
    }, 1000)

    return () => {
      clearTimeout(initialTimeout)
      clearTimeout(titleObserverTimeout)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClick)
      observer.disconnect()
      clearInterval(interval)
      // Cleanup per titleObserver se esiste
      if (titleRef.current && titleRef.current._titleObserver) {
        titleRef.current._titleObserver.disconnect()
      }
    }
  }, [children])

  // Controlla se siamo su mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 890)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Controlla se il font attivo è Munchberg o Dotty
  useEffect(() => {
    const checkFont = () => {
      if (titleRef.current) {
        const computedStyle = getComputedStyle(titleRef.current)
        const fontFamily = computedStyle.fontFamily
        setIsMunchbergFont(fontFamily.includes('Munchberg'))
        setIsDottyFont(fontFamily.includes('Dotty'))
      }
    }
    
    checkFont()
    
    // Controlla quando cambia il font
    const observer = new MutationObserver(() => {
      setTimeout(checkFont, 100)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })
    
    // Controlla anche al click (potrebbe essere il pulsante font)
    const handleClick = () => {
      setTimeout(checkFont, 300)
    }
    document.addEventListener('click', handleClick)
    
    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Gestisce l'apparizione del titolo fixed quando il titolo normale è completamente scomparso dalla viewport
  useEffect(() => {
    if (isMobile) return

    const handleScroll = () => {
      if (!titleRef.current || !fixedTitleRef.current) return

      const titleRect = titleRef.current.getBoundingClientRect()
      const header = document.querySelector('header')
      const headerHeight = header ? header.offsetHeight : 0
      
      const computedStyle = getComputedStyle(titleRef.current)
      const fontFamily = computedStyle.fontFamily
      const isMunchberg = fontFamily.includes('Munchberg')
      
      // Per Munchberg: fixedPosition = headerHeight + 30px
      // Per altri font: fixedPosition = headerHeight + 10px
      const fixedPosition = isMunchberg ? headerHeight + 30 : headerHeight + 10
      
      // Il titolo è completamente scomparso quando il bottom è < 0 (fuori dalla viewport)
      if (titleRect.bottom < 0) {
        setIsSticky(true)
        fixedTitleRef.current.style.top = `${fixedPosition}px`
        fixedTitleRef.current.style.opacity = '1'
        fixedTitleRef.current.style.display = 'block'
        fixedTitleRef.current.style.visibility = 'visible'
      } else {
        setIsSticky(false)
        fixedTitleRef.current.style.opacity = '0'
        fixedTitleRef.current.style.display = 'none' // Nascondi completamente
        fixedTitleRef.current.style.visibility = 'hidden'
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [isMobile])

  // Determina il testo da mostrare
  const displayText = isMunchbergFont && children === 'GIALLO.STUDIO' ? 'Giallo.Studio' : children
  
  // Determina il margin-top iniziale in base al font (ridotto per avvicinare all'header)
  const initialMarginTop = isMunchbergFont ? '30px' : '20px'

  const titleStyle = {
    position: 'relative',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '97vw',
    fontSize: fontSize,
    fontWeight: 'inherit',
    fontStyle: 'inherit',
    fontFamily: 'inherit',
    lineHeight: '1',
    margin: 0,
    padding: 0,
    textAlign: 'center',
    color: 'inherit',
    textTransform: isMunchbergFont ? 'none' : 'uppercase',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  }

  return (
    <>
      {/* Titolo normale in cima */}
      <h1
        ref={titleRef}
        data-responsive-title
        style={{
          ...titleStyle,
          marginTop: initialMarginTop,
          opacity: isVisible && !isMobile ? 1 : 0,
        }}
      >
        {displayText}
      </h1>

      {/* Titolo fixed che appare quando scrolli - nascosto di default */}
      <h1
        ref={fixedTitleRef}
        style={{
          ...titleStyle,
          position: 'fixed',
          top: '80px', // Verrà aggiornato da JS
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          opacity: 0,
          transition: 'opacity 0.3s ease-in-out',
          display: isMobile ? 'none' : (isSticky ? 'block' : 'none'), // Nascondi completamente quando non sticky
          visibility: isMobile ? 'hidden' : (isSticky ? 'visible' : 'hidden'),
          pointerEvents: 'none',
        }}
      >
        {displayText}
      </h1>
    </>
  )
}
