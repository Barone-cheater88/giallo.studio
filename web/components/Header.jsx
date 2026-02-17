'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import styles from './Header.module.css'

export default function Header({ menuSubtitle, logo, logoSvg, logoSvgContent }) {
  // Configurazione colori: array di oggetti con background e text
  const colorConfigurations = [
    { background: '#000000', text: '#52ea90' }, // Sfondo 01 / Testi 01 - Default on load (era punto 3)
    { background: '#f0f0f0', text: '#000000' }, // Sfondo 02 / Testi 02
    { background: '#000000', text: '#ffffff' }, // Sfondo 03 / Testi 03 (era punto 1)
    { background: '#3600e0', text: '#f0f0f0' }, // Sfondo 04 / Testi 04
    { background: '#a09fa5', text: '#3600e0' }, // Sfondo 05 / Testi 05
    { background: '#dd0000', text: '#000000' }, // Sfondo 06 / Testi 06
    { background: '#a09fa5', text: '#dd0000' }  // Sfondo 07 / Testi 07
  ]

  const [currentColorIndex, setCurrentColorIndex] = useState(0)
  const [currentFontIndex, setCurrentFontIndex] = useState(0)
  const [showBorder, setShowBorder] = useState(false)
  const [logoFilter, setLogoFilter] = useState('none')
  const [currentTime, setCurrentTime] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Fix per Safari: forza text-decoration-thickness a 1px per i button del menu
  useEffect(() => {
    const forceUnderlineThickness = () => {
      // Trova tutti i button con classe link (COLOR e FONT nel desktop)
      const menuButtons = document.querySelectorAll('button.link')
      menuButtons.forEach(button => {
        // Aggiungi event listener per hover
        const handleMouseEnter = () => {
          button.style.setProperty('text-decoration-thickness', '1px', 'important')
          button.style.setProperty('-webkit-text-decoration-thickness', '1px', 'important')
        }
        const handleMouseLeave = () => {
          button.style.setProperty('text-decoration-thickness', '1px', 'important')
          button.style.setProperty('-webkit-text-decoration-thickness', '1px', 'important')
        }
        button.addEventListener('mouseenter', handleMouseEnter)
        button.addEventListener('mouseleave', handleMouseLeave)
        // Forza anche immediatamente
        handleMouseEnter()
      })
      
      // Trova tutti i button con classe menuButton (COLOR e FONT nel mobile)
      const mobileMenuButtons = document.querySelectorAll('button.menuButton')
      mobileMenuButtons.forEach(button => {
        const handleMouseEnter = () => {
          button.style.setProperty('text-decoration-thickness', '1px', 'important')
          button.style.setProperty('-webkit-text-decoration-thickness', '1px', 'important')
          const menuText = button.querySelector('.menuText')
          if (menuText) {
            menuText.style.setProperty('text-decoration-thickness', '1px', 'important')
            menuText.style.setProperty('-webkit-text-decoration-thickness', '1px', 'important')
          }
        }
        const handleMouseLeave = () => {
          button.style.setProperty('text-decoration-thickness', '1px', 'important')
          button.style.setProperty('-webkit-text-decoration-thickness', '1px', 'important')
          const menuText = button.querySelector('.menuText')
          if (menuText) {
            menuText.style.setProperty('text-decoration-thickness', '1px', 'important')
            menuText.style.setProperty('-webkit-text-decoration-thickness', '1px', 'important')
          }
        }
        button.addEventListener('mouseenter', handleMouseEnter)
        button.addEventListener('mouseleave', handleMouseLeave)
        handleMouseEnter()
      })
    }
    
    // Esegui dopo che il DOM è pronto
    setTimeout(forceUnderlineThickness, 100)
    // Esegui anche quando cambia il font (potrebbe ricreare i button)
    const interval = setInterval(forceUnderlineThickness, 500)
    
    return () => clearInterval(interval)
  }, [currentFontIndex])

  // Blocca lo scroll del body quando il menu è aperto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Debug: verifica che il logo sia passato
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Header logo prop:', logo)
      console.log('Header logo URL:', logo?.asset?.url)
      console.log('Header logoSvg prop:', logoSvg)
      console.log('Header logoSvgContent:', logoSvgContent ? 'present' : 'missing')
    }
  }, [logo, logoSvg, logoSvgContent])

  // Aggiorna l'ora corrente ogni secondo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }
    
    updateTime() // Aggiorna immediatamente
    const interval = setInterval(updateTime, 1000) // Aggiorna ogni secondo
    
    return () => clearInterval(interval)
  }, [])

  // Gestisce lo scroll per mostrare la linea quando si scrolla
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowBorder(scrollY > 0)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Funzione helper per convertire hex a RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // Funzione helper per convertire RGB a HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
        default: h = 0
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 }
  }

  // Funzione helper per convertire HSL a RGB
  const hslToRgb = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  // Funzione helper per convertire RGB a hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // Funzione per interpolare tra due colori HSL attraversando la scala cromatica
  const interpolateHsl = (start, end, progress) => {
    // Calcola la distanza più breve sull'anello cromatico (0-360)
    let hDiff = end.h - start.h
    if (Math.abs(hDiff) > 180) {
      hDiff = hDiff > 0 ? hDiff - 360 : hDiff + 360
    }
    
    const h = (start.h + hDiff * progress + 360) % 360
    const s = start.s + (end.s - start.s) * progress
    const l = start.l + (end.l - start.l) * progress
    
    return { h, s, l }
  }

  // Funzione helper per convertire qualsiasi formato colore a RGB
  const parseColor = (color) => {
    if (!color) return null
    
    // Se è già hex
    if (color.startsWith('#')) {
      return hexToRgb(color)
    }
    
    // Se è rgb() o rgba()
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10)
      }
    }
    
    return null
  }

  // Funzione per animare la transizione di colore attraverso la scala cromatica
  const animateColorTransition = (targetColorConfig, callback) => {
    // Ottieni il colore corrente
    const currentBg = getComputedStyle(document.body).backgroundColor || 
                      getComputedStyle(document.documentElement).getPropertyValue('--dynamic-background') ||
                      colorConfigurations[currentColorIndex]?.background ||
                      '#000000'
    
    const currentText = getComputedStyle(document.body).color ||
                        getComputedStyle(document.documentElement).getPropertyValue('--color-text') ||
                        colorConfigurations[currentColorIndex]?.text ||
                        '#ffffff'

    // Converti i colori in RGB (gestendo diversi formati)
    const currentBgRgb = parseColor(currentBg) || hexToRgb(currentBg) || { r: 0, g: 0, b: 0 }
    const currentTextRgb = parseColor(currentText) || hexToRgb(currentText) || { r: 255, g: 255, b: 255 }
    const targetBgRgb = hexToRgb(targetColorConfig.background)
    const targetTextRgb = hexToRgb(targetColorConfig.text)

    if (!targetBgRgb || !targetTextRgb) {
      // Se la conversione fallisce, applica direttamente
      if (callback) callback()
      return
    }

    const currentBgHsl = rgbToHsl(currentBgRgb.r, currentBgRgb.g, currentBgRgb.b)
    const currentTextHsl = rgbToHsl(currentTextRgb.r, currentTextRgb.g, currentTextRgb.b)
    const targetBgHsl = rgbToHsl(targetBgRgb.r, targetBgRgb.g, targetBgRgb.b)
    const targetTextHsl = rgbToHsl(targetTextRgb.r, targetTextRgb.g, targetTextRgb.b)

    // Animazione: 60 step per una transizione fluida
    const steps = 60
    const duration = 800 // 0.8 secondi
    const stepDuration = duration / steps
    let currentStep = 0

    const animationInterval = setInterval(() => {
      const progress = currentStep / steps
      
      // Interpola i colori attraverso la scala cromatica
      const bgHsl = interpolateHsl(currentBgHsl, targetBgHsl, progress)
      const textHsl = interpolateHsl(currentTextHsl, targetTextHsl, progress)
      
      // Converti HSL in RGB e poi in hex
      const bgRgb = hslToRgb(bgHsl.h, bgHsl.s, bgHsl.l)
      const textRgb = hslToRgb(textHsl.h, textHsl.s, textHsl.l)
      
      const bgHex = rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b)
      const textHex = rgbToHex(textRgb.r, textRgb.g, textRgb.b)
      
      // Applica i colori intermedi
      document.documentElement.style.setProperty('--dynamic-background', bgHex)
      document.body.style.backgroundColor = bgHex
      
      const header = document.querySelector('header')
      if (header) {
        header.style.backgroundColor = bgHex
      }
      
      document.body.style.color = textHex
      document.documentElement.style.setProperty('--color-text', textHex)
      
      currentStep++
      
      if (currentStep > steps) {
        clearInterval(animationInterval)
        // Applica il colore finale esatto
        if (callback) {
          callback()
        }
      }
    }, stepDuration)
  }

  // Funzione per applicare colore di sfondo e testo
  const applyColor = (colorConfig) => {
    if (colorConfig) {
      document.documentElement.style.setProperty('--dynamic-background', colorConfig.background)
      document.body.style.backgroundColor = colorConfig.background
      
      const header = document.querySelector('header')
      if (header) {
        header.style.backgroundColor = colorConfig.background
      }
      
      document.body.style.color = colorConfig.text
      document.documentElement.style.setProperty('--color-text', colorConfig.text)
    }
  }

  // Carica l'indice salvato da localStorage al mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('colorIndex')
    if (savedIndex !== null) {
      const index = parseInt(savedIndex, 10)
      if (index >= 0 && index < colorConfigurations.length) {
        setCurrentColorIndex(index)
        setTimeout(() => {
          applyColor(colorConfigurations[index])
        }, 0)
      } else {
        // Se l'indice non è valido, applica il default (indice 0)
        applyColor(colorConfigurations[0])
      }
    } else {
      // Nessun colore salvato, applica il default (indice 0)
      applyColor(colorConfigurations[0])
    }
  }, [])

  // Gestisce il filtro del logo in base al colore di sfondo
  useEffect(() => {
    const checkBackgroundColor = () => {
      const currentConfig = colorConfigurations[currentColorIndex]
      if (currentConfig) {
        const bgColor = currentConfig.background.toLowerCase()
        // Logo nero su sfondi chiari, logo bianco su sfondi scuri
        // Sfondi chiari: #f0f0f0, #a09fa5, #dd0000, #3600e0
        // Sfondi scuri: #000000
        if (bgColor === '#f0f0f0' || bgColor === '#a09fa5' || bgColor === '#dd0000' || bgColor === '#3600e0') {
          setLogoFilter('none') // Logo nero
        } else {
          setLogoFilter('brightness(0) invert(1)') // Logo bianco
        }
      }
    }

    checkBackgroundColor()

    const observer = new MutationObserver(checkBackgroundColor)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    return () => observer.disconnect()
  }, [currentColorIndex])

  // Aggiorna il colore dell'SVG quando cambia il colore del sito (come nel Footer)
  useEffect(() => {
    if (!logoSvgContent) return

    const updateSvgColor = () => {
      const container = document.querySelector('.headerLogoContainer')
      if (!container) return

      const svg = container.querySelector('svg')
      if (!svg) return

      // Ottieni il colore corrente dal body (che viene modificato da Header.jsx)
      const bodyColor = getComputedStyle(document.body).color
      const cssVarColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
      const currentColor = cssVarColor || bodyColor || getComputedStyle(document.body).getPropertyValue('color') || '#000000'

      // Applica il colore direttamente
      container.style.color = currentColor
      container.style.setProperty('color', currentColor, 'important')
      svg.style.color = currentColor
      svg.style.setProperty('color', currentColor, 'important')
      svg.style.fill = 'currentColor'
      svg.style.setProperty('fill', 'currentColor', 'important')

      // Applica direttamente il colore RGB/HEX a tutti gli elementi SVG
      const allElements = svg.querySelectorAll('*')
      allElements.forEach(el => {
        const fill = el.getAttribute('fill')
        const stroke = el.getAttribute('stroke')
        
        // Applica il colore direttamente come valore RGB/HEX invece di currentColor
        if (fill !== 'none' && fill !== null) {
          el.setAttribute('fill', currentColor)
          el.style.fill = currentColor
          el.style.setProperty('fill', currentColor, 'important')
        }
        if (stroke !== 'none' && stroke !== null) {
          el.setAttribute('stroke', currentColor)
          el.style.stroke = currentColor
          el.style.setProperty('stroke', currentColor, 'important')
        }
      })
      
      // Applica anche al tag SVG stesso
      svg.setAttribute('fill', currentColor)
      svg.style.fill = currentColor
    }

    // Aggiorna immediatamente e poi periodicamente
    setTimeout(updateSvgColor, 50)
    setTimeout(updateSvgColor, 200)
    setTimeout(updateSvgColor, 500)

    const observer = new MutationObserver(() => {
      setTimeout(updateSvgColor, 10)
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style']
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    })

    const interval = setInterval(updateSvgColor, 200)

    // Ascolta anche i click (potrebbe essere il pulsante Color)
    const handleClick = () => {
      setTimeout(updateSvgColor, 100)
    }
    document.addEventListener('click', handleClick)

    return () => {
      observer.disconnect()
      clearInterval(interval)
      document.removeEventListener('click', handleClick)
    }
  }, [logoSvgContent])

  const handleColorClick = (e) => {
    e.preventDefault()
    const nextIndex = (currentColorIndex + 1) % colorConfigurations.length
    setCurrentColorIndex(nextIndex)
    
    const nextColorConfig = colorConfigurations[nextIndex]
    if (nextColorConfig) {
      // Anima la transizione attraverso la scala cromatica
      animateColorTransition(nextColorConfig, () => {
        applyColor(nextColorConfig)
        localStorage.setItem('colorIndex', nextIndex.toString())
      })
    }
  }

  // Configurazioni complete per ogni font e classe tipografica
  const fontConfigurations = {
    'Times New Roman': {
      family: '"Times New Roman", Times, serif',
      style: 'italic',
      classes: {
        heading: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '32px',
          sizeMobile: '22px'
        },
        subtitle: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '32px',
          sizeMobile: '22px'
        },
        body: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '18px',
          sizeMobile: '15px'
        },
        caption: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '12px',
          sizeMobile: '11px'
        }
      }
    },
    'Helvetica': {
      family: 'Helvetica, Arial, sans-serif',
      style: 'normal',
      classes: {
        heading: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '28px',
          sizeMobile: '22px'
        },
        subtitle: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '28px',
          sizeMobile: '22px'
        },
        body: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '16px',
          sizeMobile: '15px'
        },
        caption: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '10px',
          sizeMobile: '10px'
        }
      }
    },
    'IBM Plex Mono': {
      family: '"IBM Plex Mono", monospace',
      style: 'normal',
      classes: {
        heading: {
          weight: '500',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '32px',
          sizeMobile: '20px'
        },
        subtitle: {
          weight: '500',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '25px',
          sizeMobile: '20px'
        },
        body: {
          weight: '500',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '14px',
          sizeMobile: '13px'
        },
        caption: {
          weight: '500',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '10px',
          sizeMobile: '10px'
        }
      }
    },
    'Comic Sans': {
      family: '"ComicSansMS", sans-serif',
      style: 'normal',
      classes: {
        heading: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.3',
          sizeDesktop: '28px',
          sizeMobile: '20px'
        },
        subtitle: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.3',
          sizeDesktop: '28px',
          sizeMobile: '20px'
        },
        body: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.3',
          sizeDesktop: '15px',
          sizeMobile: '14px'
        },
        caption: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.3',
          sizeDesktop: '10px',
          sizeMobile: '10px'
        }
      }
    },
    'Munchberg': {
      family: '"Munchberg", sans-serif',
      style: 'normal',
      classes: {
        heading: {
          weight: '400',
          transform: 'capitalize',
          lineHeight: '1',
          sizeDesktop: '45px',
          sizeMobile: '24px'
        },
        subtitle: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1',
          sizeDesktop: '45px',
          sizeMobile: '28px'
        },
        body: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1',
          sizeDesktop: '22px',
          sizeMobile: '18px'
        },
        caption: {
          weight: '400',
          transform: 'capitalize',
          lineHeight: '1',
          sizeDesktop: '18px',
          sizeMobile: '15px'
        }
      }
    },
    'Droulers': {
      family: '"Droulers", sans-serif',
      style: 'normal',
      classes: {
        heading: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '27px',
          sizeMobile: '22px'
        },
        subtitle: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '27px',
          sizeMobile: '22px'
        },
        body: {
          weight: '400',
          transform: 'normal',
          lineHeight: '1.1',
          sizeDesktop: '14px',
          sizeMobile: '12px'
        },
        caption: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '1.1',
          sizeDesktop: '10px',
          sizeMobile: '10px'
        }
      }
    },
    'Dotty': {
      family: '"Dotty", sans-serif',
      style: 'normal',
      classes: {
        heading: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '0.68',
          sizeDesktop: '56px',
          sizeMobile: '36px'
        },
        subtitle: {
          weight: '400',
          transform: 'normal',
          lineHeight: '0.68',
          sizeDesktop: '48px',
          sizeMobile: '42px'
        },
        body: {
          weight: '400',
          transform: 'normal',
          lineHeight: '0.68',
          sizeDesktop: '32px',
          sizeMobile: '24px'
        },
        caption: {
          weight: '400',
          transform: 'uppercase',
          lineHeight: '0.68',
          sizeDesktop: '20px',
          sizeMobile: '16px'
        }
      }
    }
  }

  // Funzione helper per ottenere i font disponibili
  const getAvailableFonts = () => {
    return [
      { name: 'Helvetica' }, // Default on load (era punto 2)
      { name: 'Times New Roman' }, // Era punto 1
      { name: 'IBM Plex Mono' },
      { name: 'Comic Sans' },
      { name: 'Munchberg' },
      { name: 'Droulers' },
      { name: 'Dotty' }
    ]
  }

  // Carica l'indice del font salvato da localStorage al mount
  useEffect(() => {
    const availableFonts = getAvailableFonts()
    const savedFontIndex = localStorage.getItem('fontIndex')
    
    if (savedFontIndex !== null) {
      const index = parseInt(savedFontIndex, 10)
      if (index >= 0 && index < availableFonts.length) {
        setCurrentFontIndex(index)
        applyFont(availableFonts[index].name)
      } else {
        // Se l'indice salvato non è valido, applica il default (Helvetica)
        applyFont('Helvetica')
      }
    } else {
      // Nessun font salvato, applica il default (Helvetica)
      applyFont('Helvetica')
    }
  }, [])

  const applyFont = (fontName) => {
    const config = fontConfigurations[fontName]
    if (!config) return

    // Aggiungi/rimuovi classe per Munchberg font
    if (typeof document !== 'undefined') {
      // Usa setTimeout per assicurarsi che il DOM sia pronto
      setTimeout(() => {
        // Rimuovi tutte le classi font prima di aggiungere quella corretta
        const fontClasses = ['font-munchberg', 'font-ibm-plex-mono', 'font-dotty', 'font-times-new-roman', 'font-helvetica', 'font-comic-sans', 'font-droulers']
        fontClasses.forEach(className => {
          document.body.classList.remove(className)
          document.documentElement.classList.remove(className)
        })
        
        // Aggiungi la classe corretta per il font attivo
        if (fontName === 'Munchberg') {
          document.body.classList.add('font-munchberg')
          document.documentElement.classList.add('font-munchberg')
        } else if (fontName === 'IBM Plex Mono') {
          document.body.classList.add('font-ibm-plex-mono')
          document.documentElement.classList.add('font-ibm-plex-mono')
        } else if (fontName === 'Dotty') {
          document.body.classList.add('font-dotty')
          document.documentElement.classList.add('font-dotty')
        } else if (fontName === 'Times New Roman') {
          document.body.classList.add('font-times-new-roman')
          document.documentElement.classList.add('font-times-new-roman')
        } else if (fontName === 'Helvetica') {
          document.body.classList.add('font-helvetica')
          document.documentElement.classList.add('font-helvetica')
        } else if (fontName === 'Comic Sans') {
          document.body.classList.add('font-comic-sans')
          document.documentElement.classList.add('font-comic-sans')
        } else if (fontName === 'Droulers') {
          document.body.classList.add('font-droulers')
          document.documentElement.classList.add('font-droulers')
        }
      }, 0)
    }

    // Applica le variabili CSS per ogni classe tipografica
    // Headings
    document.documentElement.style.setProperty('--font-heading', config.family)
    document.documentElement.style.setProperty('--font-heading-weight', config.classes.heading.weight)
    document.documentElement.style.setProperty('--font-heading-style', config.style)
    document.documentElement.style.setProperty('--font-heading-transform', config.classes.heading.transform)
    document.documentElement.style.setProperty('--font-heading-line-height', config.classes.heading.lineHeight)
    document.documentElement.style.setProperty('--font-heading-size-desktop', config.classes.heading.sizeDesktop)
    document.documentElement.style.setProperty('--font-heading-size-mobile', config.classes.heading.sizeMobile)

    // Subtitles
    document.documentElement.style.setProperty('--font-subtitle', config.family)
    document.documentElement.style.setProperty('--font-subtitle-weight', config.classes.subtitle.weight)
    document.documentElement.style.setProperty('--font-subtitle-style', config.style)
    document.documentElement.style.setProperty('--font-subtitle-transform', config.classes.subtitle.transform)
    document.documentElement.style.setProperty('--font-subtitle-line-height', config.classes.subtitle.lineHeight)
    document.documentElement.style.setProperty('--font-subtitle-size-desktop', config.classes.subtitle.sizeDesktop)
    document.documentElement.style.setProperty('--font-subtitle-size-mobile', config.classes.subtitle.sizeMobile)

    // Body
    document.documentElement.style.setProperty('--font-body', config.family)
    document.documentElement.style.setProperty('--font-body-weight', config.classes.body.weight)
    document.documentElement.style.setProperty('--font-body-style', config.style)
    document.documentElement.style.setProperty('--font-body-transform', config.classes.body.transform)
    document.documentElement.style.setProperty('--font-body-line-height', config.classes.body.lineHeight)
    document.documentElement.style.setProperty('--font-body-size-desktop', config.classes.body.sizeDesktop)
    document.documentElement.style.setProperty('--font-body-size-mobile', config.classes.body.sizeMobile)

    // Captions
    document.documentElement.style.setProperty('--font-caption', config.family)
    document.documentElement.style.setProperty('--font-caption-weight', config.classes.caption.weight)
    document.documentElement.style.setProperty('--font-caption-style', config.style)
    document.documentElement.style.setProperty('--font-caption-transform', config.classes.caption.transform)
    document.documentElement.style.setProperty('--font-caption-line-height', config.classes.caption.lineHeight)
    document.documentElement.style.setProperty('--font-caption-size-desktop', config.classes.caption.sizeDesktop)
    document.documentElement.style.setProperty('--font-caption-size-mobile', config.classes.caption.sizeMobile)

    // Applica anche direttamente a tutti gli elementi per assicurarsi che il font cambi ovunque
    // Nota: per weight, usiamo il weight del body come default, ma le classi specifiche useranno le variabili CSS
    // ESCLUDI gli elementi con data-fixed-font="true" (es. titolo Giallo.Studio)
    const allElements = document.querySelectorAll('*:not([data-fixed-font="true"])')
    allElements.forEach(el => {
      el.style.fontFamily = config.family
      el.style.fontStyle = config.style
      // Il weight viene gestito dalle variabili CSS per classe
    })

    // Se è Comic Sans, aumenta il padding verticale delle righe della tabella per evitare taglio dei discendenti
    if (fontName === 'Comic Sans') {
      const tableRows = document.querySelectorAll('.row:not(.header)')
      tableRows.forEach(row => {
        row.style.paddingTop = '8px'
        row.style.paddingBottom = '8px'
      })
      // Aumenta anche il line-height delle celle per Comic Sans
      const tableCells = document.querySelectorAll('.row:not(.header) .cell')
      tableCells.forEach(cell => {
        cell.style.lineHeight = '1.4'
        cell.style.paddingTop = '0.15em'
        cell.style.paddingBottom = '0.15em'
      })
    } else {
      // Ripristina il padding originale per gli altri font
      const tableRows = document.querySelectorAll('.row:not(.header)')
      tableRows.forEach(row => {
        row.style.paddingTop = ''
        row.style.paddingBottom = ''
      })
      const tableCells = document.querySelectorAll('.row:not(.header) .cell')
      tableCells.forEach(cell => {
        cell.style.lineHeight = ''
        cell.style.paddingTop = ''
        cell.style.paddingBottom = ''
      })
    }
    
    // Se è Dotty, applica l'ombra bagliore a tutti gli elementi e aggiungi classe al body
    if (fontName === 'Dotty') {
      // La classe font-dotty viene già gestita nella funzione applyFont sopra
      allElements.forEach(el => {
        el.style.setProperty('text-shadow', '0 0 4px currentColor', 'important')
      })
    } else {
      // Rimuovi l'ombra per gli altri font (la classe viene già gestita nella funzione applyFont sopra)
      allElements.forEach(el => {
        el.style.removeProperty('text-shadow')
      })
    }
  }

  // Funzione semplice per fade out/in veloce di tutto il contenuto (mantenendo solo il background)
  const animateFontChange = (targetFontName, callback) => {
    const targetConfig = fontConfigurations[targetFontName]
    if (!targetConfig) {
      if (callback) callback()
      return
    }

    // Trova TUTTI gli elementi visibili (escludendo body, html e elementi con background)
    const allElements = document.querySelectorAll(`
      *:not([data-fixed-font="true"]):not(script):not(style):not(noscript):not([data-no-fade]):not(body):not(html)
    `)
    
    const elementsToAnimate = []
    
    // Raccogli tutti gli elementi visibili (escludendo quelli nascosti o senza contenuto visibile)
    allElements.forEach(el => {
      const tagName = el.tagName?.toLowerCase()
      // Escludi elementi che non dovrebbero essere animati
      if (!['script', 'style', 'noscript', 'meta', 'link', 'title', 'head', 'body', 'html'].includes(tagName)) {
        const computedStyle = getComputedStyle(el)
        // Includi solo elementi visibili (non display: none)
        if (computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden') {
          elementsToAnimate.push(el)
        }
      }
    })

    // FASE 1: Fade out - tutto scompare (tranne il background del body)
    // Nascondi anche il titolo responsive per evitare ridimensionamenti visibili
    const responsiveTitle = document.querySelector('h1[class*="siteTitle"]')
    // Nascondi anche i pallini dei progetti (rowBullet) per evitare che appaiano durante l'animazione
    const rowBullets = document.querySelectorAll('[class*="rowBullet"]')
    
    if (responsiveTitle) {
      responsiveTitle.style.transition = 'opacity 0.15s ease-out'
      responsiveTitle.style.opacity = '0'
    }
    
    rowBullets.forEach(bullet => {
      if (bullet.isConnected) {
        bullet.style.transition = 'opacity 0.15s ease-out'
        bullet.style.opacity = '0'
      }
    })
    
    elementsToAnimate.forEach(el => {
      if (el.isConnected) {
        el.style.transition = 'opacity 0.15s ease-out'
        el.style.opacity = '0'
      }
    })

    // Dopo il fade out, applica il nuovo font e fai il fade in
    setTimeout(() => {
      // Applica il nuovo font agli elementi di testo
      elementsToAnimate.forEach(el => {
        if (el.isConnected) {
          const tagName = el.tagName?.toLowerCase()
          // Applica il font solo agli elementi che possono avere testo
          if (!['img', 'svg', 'canvas', 'video', 'iframe'].includes(tagName)) {
            el.style.fontFamily = targetConfig.family
            el.style.fontStyle = targetConfig.style
            el.style.fontWeight = targetConfig.classes?.body?.weight || '400'
          }
        }
      })

      // Applica anche il font tramite la callback per assicurarsi che tutto sia configurato correttamente
      if (callback) {
        callback()
      }

      // Aspetta un po' di più per permettere al font di caricarsi e al titolo di ricalcolare
      setTimeout(() => {
        // FASE 2: Fade in - tutto riappare
        if (responsiveTitle) {
          responsiveTitle.style.transition = 'opacity 0.15s ease-in'
          responsiveTitle.style.opacity = '1'
        }
        
        elementsToAnimate.forEach(el => {
          if (el.isConnected) {
            el.style.transition = 'opacity 0.15s ease-in'
            el.style.opacity = '1'
          }
        })
        
        // Ripristina i pallini dei progetti (rimangono invisibili di default, visibili solo al hover)
        rowBullets.forEach(bullet => {
          if (bullet.isConnected) {
            bullet.style.transition = ''
            bullet.style.opacity = '' // Ripristina l'opacity originale (0 di default)
          }
        })
        
        // Rimuovi le transizioni dopo l'animazione
        setTimeout(() => {
          if (responsiveTitle) {
            responsiveTitle.style.transition = ''
            responsiveTitle.style.opacity = ''
          }
          
          elementsToAnimate.forEach(el => {
            if (el.isConnected) {
              el.style.transition = ''
              el.style.opacity = ''
            }
          })
        }, 150)
      }, 50) // Delay per permettere al font di caricarsi e al titolo di ricalcolare
    }, 150) // Durata del fade out
  }

  const handleFontClick = (e) => {
    e.preventDefault()
    const availableFonts = getAvailableFonts()
    const nextIndex = (currentFontIndex + 1) % availableFonts.length
    setCurrentFontIndex(nextIndex)
    
    const nextFont = availableFonts[nextIndex]
    if (nextFont) {
      // Avvia l'animazione fade out/in veloce
      animateFontChange(nextFont.name, () => {
        applyFont(nextFont.name)
        localStorage.setItem('fontIndex', nextIndex.toString())
        // Assicurati che le classi font vengano applicate anche dopo l'animazione
        if (typeof document !== 'undefined') {
          if (nextFont.name === 'Munchberg') {
            document.body.classList.add('font-munchberg')
          } else {
            document.body.classList.remove('font-munchberg')
          }
        }
      })
    }
  }

  const logoSvgUrl = logoSvg?.asset?.url
  const logoUrl = logo?.asset?.url

  // Debug temporaneo
  if (process.env.NODE_ENV === 'development') {
    console.log('Header render - logoSvgContent:', logoSvgContent ? 'present' : 'missing')
    console.log('Header render - logoSvgUrl:', logoSvgUrl)
    console.log('Header render - logoUrl:', logoUrl)
  }

  return (
    <>
      {/* Menu fixed */}
      <header 
        className={styles.header}
        style={{
          borderBottom: showBorder ? '1px solid currentColor' : 'none',
          transition: 'border-bottom 0.2s ease-out'
        }}
      >
        {/* Layout mobile: due colonne */}
        <div className={styles.mobileHeader}>
          {/* Prima colonna: Logo */}
          <div className={styles.mobileLogoColumn}>
            <Link href="/" className={styles.logoLink}>
              {logoSvgContent ? (
                <div 
                  className={`${styles.logoContainer} headerLogoContainer`}
                  style={{ 
                    color: 'inherit',
                    fill: 'currentColor'
                  }}
                  dangerouslySetInnerHTML={{ __html: logoSvgContent }}
                />
              ) : logoSvgUrl ? (
                <div className={styles.logoContainer}>
                  <img 
                    src={logoSvgUrl} 
                    alt="Giallo Studio Logo" 
                    style={{ 
                      maxHeight: '18px',
                      height: '18px',
                      width: 'auto',
                      maxWidth: 'auto',
                      filter: 'brightness(0) saturate(100%)',
                      opacity: 1
                    }}
                  />
                </div>
              ) : logoUrl ? (
                <div className={styles.logoContainer}>
                  <img 
                    src={logoUrl} 
                    alt="Giallo Studio Logo" 
                    style={{ 
                      maxHeight: '18px',
                      height: '18px',
                      width: 'auto',
                      maxWidth: 'auto',
                      filter: logoFilter,
                      opacity: 1
                    }}
                  />
                </div>
              ) : null}
            </Link>
          </div>

          {/* Seconda colonna: COLOR / FONT / MENU - Versione normale (nascondi se Munchberg) */}
          {(() => {
            const availableFonts = getAvailableFonts()
            const isMunchbergActive = availableFonts[currentFontIndex]?.name === 'Munchberg'
            return (
              <>
                {!isMunchbergActive && (
                  <div className={styles.mobileMenuColumn}>
                    <button 
                      onClick={handleColorClick}
                      className={styles.menuButton}
                    >
                      <span className={styles.menuText}>COLOR</span>
                    </button>
                    <span className={styles.mobileSeparator}> / </span>
                    <button 
                      onClick={handleFontClick}
                      className={styles.menuButton}
                    >
                      <span className={styles.menuText}>FONT</span>
                    </button>
                    <span className={styles.mobileSeparator}> / </span>
                    <button 
                      onClick={() => setIsMenuOpen(true)}
                      className={styles.menuButton}
                    >
                      <span className={styles.menuText}>MENU</span>
                    </button>
                  </div>
                )}
                {/* Versione Munchberg: Color / Font / Menu (capitalize) */}
                {isMunchbergActive && (
                  <div className={styles.mobileMenuColumn}>
                    <button 
                      onClick={handleColorClick}
                      className={styles.menuButton}
                    >
                      <span className={styles.menuText}>Color</span>
                    </button>
                    <span className={styles.mobileSeparator}> / </span>
                    <button 
                      onClick={handleFontClick}
                      className={styles.menuButton}
                    >
                      <span className={styles.menuText}>Font</span>
                    </button>
                    <span className={styles.mobileSeparator}> / </span>
                    <button 
                      onClick={() => setIsMenuOpen(true)}
                      className={styles.menuButton}
                    >
                      <span className={styles.menuText}>Menu</span>
                    </button>
                  </div>
                )}
              </>
            )
          })()}
        </div>

        {/* Layout desktop: menu completo */}
        <div className={styles.desktopHeader}>
          <div className={styles.currentTime}>{currentTime}</div>
          <Link href="/archiviallo" className={styles.funHere}>Fun Here →</Link>
          <div className={styles.headerContent}>
            <nav className={styles.nav}>
              <Link 
                href="/" 
                className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}
              >
                Projects
              </Link>
              <span className={styles.separator}> / </span>
              <Link 
                href="/about" 
                className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}
              >
                About
              </Link>
              <span className={styles.separator}> / </span>
              <Link 
                href="/contacts" 
                className={`${styles.link} ${pathname === '/contacts' ? styles.active : ''}`}
              >
                Contacts
              </Link>
              <span className={styles.separator}> / </span>
              <button 
                onClick={handleColorClick}
                className={styles.link}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: 0, 
                  font: 'inherit',
                  textTransform: 'inherit',
                  color: 'inherit'
                }}
              >
                Color
              </button>
              <span className={styles.separator}> / </span>
              <button 
                onClick={handleFontClick}
                className={styles.link}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: 0, 
                  font: 'inherit',
                  textTransform: 'inherit',
                  color: 'inherit'
                }}
              >
                Font
              </button>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Spacer per il menu fixed */}
      <div className={styles.headerSpacer} />
      
      {/* Subtitle non fixed */}
      {menuSubtitle && Array.isArray(menuSubtitle) && menuSubtitle.length > 0 && (
        <div className={styles.subtitleSection}>
          <div className={styles.claim}>
            <PortableText
              value={menuSubtitle}
              components={{
                marks: {
                  link: ({ children, value }) => {
                    const { href, openInNewTab } = value || {}
                    if (!href) return <>{children}</>
                    const target = openInNewTab ? '_blank' : undefined
                    const rel = openInNewTab ? 'noopener noreferrer' : undefined
                    return (
                      <a
                        href={href}
                        target={target}
                        rel={rel}
                        style={{
                          color: 'inherit',
                          textDecoration: 'underline',
                          textDecorationThickness: '1px',
                          textUnderlineOffset: '2px'
                        }}
                      >
                        {children}
                      </a>
                    )
                  },
                  strong: ({ children }) => <strong>{children}</strong>,
                  em: ({ children }) => <em>{children}</em>
                },
                block: {
                  normal: ({ children }) => <p style={{ margin: 0, marginBottom: '0.5em' }}>{children}</p>
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Popup Menu a tutto schermo */}
      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          {/* Header del popup (uguale all'header mobile ma con X) */}
          <header className={styles.menuPopupHeader}>
            <div className={styles.mobileHeader}>
              {/* Prima colonna: Logo */}
              <div className={styles.mobileLogoColumn}>
                <Link href="/" className={styles.logoLink} onClick={() => setIsMenuOpen(false)}>
                  {logoSvgContent ? (
                    <div 
                      className={`${styles.logoContainer} headerLogoContainer`}
                      style={{ 
                        color: 'inherit',
                        fill: 'currentColor'
                      }}
                      dangerouslySetInnerHTML={{ __html: logoSvgContent }}
                    />
                  ) : logoSvgUrl ? (
                    <div className={styles.logoContainer}>
                      <img 
                        src={logoSvgUrl} 
                        alt="Giallo Studio Logo" 
                        style={{ 
                          maxWidth: '60px', 
                          maxHeight: '24px',
                          height: 'auto',
                          filter: 'brightness(0) saturate(100%)',
                          opacity: 1
                        }}
                      />
                    </div>
                  ) : logoUrl ? (
                    <div className={styles.logoContainer}>
                      <img 
                        src={logoUrl} 
                        alt="Giallo Studio Logo" 
                        style={{ 
                          maxWidth: '60px', 
                          maxHeight: '24px',
                          height: 'auto',
                          filter: logoFilter,
                          opacity: 1
                        }}
                      />
                    </div>
                  ) : null}
                </Link>
              </div>

              {/* Seconda colonna: X per chiudere */}
              <div className={styles.mobileMenuColumn}>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className={styles.menuButton}
                >
                  <span className={styles.menuText}>X</span>
                </button>
              </div>
            </div>
          </header>

          {/* Contenuto del menu */}
          <div className={styles.menuContent}>
            <nav className={styles.menuNav}>
              {(() => {
                const availableFonts = getAvailableFonts()
                const isMunchbergActive = availableFonts[currentFontIndex]?.name === 'Munchberg'
                return (
                  <>
                    {!isMunchbergActive ? (
                      <>
                        <Link 
                          href="/" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Projects <span className={styles.menuArrow}>→</span>
                        </Link>
                        <Link 
                          href="/about" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          About <span className={styles.menuArrow}>→</span>
                        </Link>
                        <Link 
                          href="/contacts" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Contacts <span className={styles.menuArrow}>→</span>
                        </Link>
                        <Link 
                          href="/archiviallo" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          FUN HERE →
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link 
                          href="/" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Projects <span className={styles.menuArrow}>→</span>
                        </Link>
                        <Link 
                          href="/about" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          About <span className={styles.menuArrow}>→</span>
                        </Link>
                        <Link 
                          href="/contacts" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Contacts <span className={styles.menuArrow}>→</span>
                        </Link>
                        <Link 
                          href="/archiviallo" 
                          className={styles.menuItem}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Fun Here →
                        </Link>
                      </>
                    )}
                  </>
                )
              })()}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
